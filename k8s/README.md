# Run this app on Docker Desktop Kubernetes

Run commands from `E:\pj\redistrial` in PowerShell. This setup targets the
`docker-desktop` context, `default` namespace, and the single kind node named
`desktop-control-plane`.

## What prevented startup

1. Both pods reported `ErrImageNeverPull`. The manifest uses `imagePullPolicy:
   Never`, so the images must already exist **inside the Kubernetes node**.
   `docker images` showed both `v1` images, but the node's containerd image store
   did not contain them. Docker Compose and this Kubernetes node use separate
   image stores. Changing the policy alone would not publish these local images.
2. `backend-env` did not exist. After loading the image, the backend still cannot
   start until this Secret exists in the same namespace as its Deployment.
3. Both Services are `ClusterIP`, which does not publish host ports. Additionally,
   Compose containers already occupied localhost ports 3000 and 4000. Visiting
   those ports was reaching Compose, not Kubernetes.
4. Once images loaded, frontend `v1` crashed because it had no production `.next`
   build. The current Dockerfile includes `npm run build`; rebuilding as `v2`
   and updating the manifest fixes this stale-image problem.

The Deployment selectors, pod labels, Service selectors, and container ports
match. Readiness probes were added so Services only route to responding apps.
The actual manifest is `k8s/app.yaml`; `frontend/k8s/app.yaml` was not on disk.

## Startup steps

### 1. Build images when source changes

```powershell
docker build -t redistrial-backend:v1 ./backend
docker build -t redistrial-frontend:v2 ./frontend
```

Skip building only if the backend `v1` and frontend `v2` images already exist.

### 2. Import images into this node

```powershell
docker image save -o k8s/local-images.tar redistrial-backend:v1 redistrial-frontend:v2
cmd.exe /d /c "docker exec -i desktop-control-plane ctr -n k8s.io images import - < E:\pj\redistrial\k8s\local-images.tar"
docker exec desktop-control-plane ctr -n k8s.io images list -q
```

Check each command succeeds before proceeding. Importing large images takes time.
With multiple nodes, load the images on every node that can schedule these pods.
The binary archive is streamed using cmd.exe redirection because Windows
PowerShell text pipelines can corrupt binary data. After a successful import,
remove the temporary archive:

```powershell
Remove-Item -LiteralPath E:\pj\redistrial\k8s\local-images.tar
```

### 3. Create the backend Secret and deploy

The following helper copies `backend/.env` credentials into your local cluster.
It requires Node.js 22 or newer and parses quoted values
properly. Do not commit `.env` or dump the Secret into a tracked YAML file.

```powershell
node k8s/create-secret.mjs
kubectl --context=docker-desktop -n default apply -f k8s/app.yaml
kubectl --context=docker-desktop -n default rollout status deployment/backend --timeout=120s
kubectl --context=docker-desktop -n default rollout status deployment/frontend --timeout=120s
kubectl --context=docker-desktop -n default get pods,svc
```

If replacing images under the same tag or updating the Secret, restart the pods:

```powershell
kubectl --context=docker-desktop -n default rollout restart deployment/backend deployment/frontend
```

### 4. Expose the app locally

Stop the two Compose application containers to free their ports (this preserves
the containers and does not remove volumes):

```powershell
docker compose stop frontend backend
```

Keep these commands running in **two separate terminals**:

```powershell
kubectl --context=docker-desktop -n default port-forward service/frontend 3000:3000
```

```powershell
kubectl --context=docker-desktop -n default port-forward service/backend 4000:4000
```

Open http://localhost:3000 and test http://localhost:4000/api/health.
Restart port-forward commands if their selected pods are replaced.

## Request flow

```text
Browser -> localhost:3000 -> frontend port-forward -> Next.js pod
Browser JavaScript -> localhost:4000/api -> backend port-forward -> Express pod
Express -> external PostgreSQL / Upstash Redis using backend-env credentials
```

The frontend's browser-side API default is `http://localhost:4000/api`.
The backend allows the origin `http://localhost:3000`. Therefore both forwards
are needed. Kubernetes service DNS `backend:4000` is usable inside the cluster,
but is not resolvable by a browser on your host. For remote deployment, configure
a public API endpoint at frontend build time and update the backend CORS origin.

## Diagnose failures

```powershell
kubectl --context=docker-desktop -n default describe pods
kubectl --context=docker-desktop -n default logs deployment/backend --tail=50
kubectl --context=docker-desktop -n default logs deployment/frontend --tail=50
kubectl --context=docker-desktop -n default get events --sort-by=.lastTimestamp
```

`ErrImageNeverPull`: image missing in the node. `CreateContainerConfigError`:
inspect missing Secret/configuration. `CrashLoopBackOff`: inspect application
logs. Running but unreachable: check readiness and port forwarding.
The API health route verifies the HTTP server only, not database, Redis, email,
or a complete authenticated user workflow.

## Verified after the fix

- Backend and frontend Deployments: `1/1` ready; final pods had zero restarts.
- Frontend through Kubernetes port forwarding: HTTP 200 at localhost:3000.
- Backend through Kubernetes port forwarding: HTTP 200 with `{"status":"ok"}`.
- Backend CORS allows `http://localhost:3000` with credentials.
- A read-only PostgreSQL `SELECT 1` from the backend pod succeeded.
- Upstash Redis ping from the backend pod returned `PONG`.
- Compose application containers were stopped, preserving their data.

Background port-forward processes were started for this session (backend PID
23208, frontend PID 23900). They must remain running for browser access. After a
reboot or pod replacement, use the two foreground commands above. To find and
stop these forwards later, inspect process command lines before stopping the
matching processes; Windows can reuse PIDs. Signup, email delivery, and a full
authenticated workflow were not tested.

References: [kind image loading](https://kind.sigs.k8s.io/docs/user/quick-start/#loading-an-image-into-your-cluster)
and [Docker Desktop Kubernetes](https://docs.docker.com/desktop/use-desktop/kubernetes/).
