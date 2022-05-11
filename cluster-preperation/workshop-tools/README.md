This image provides `oc`, `helm`, `kam` and `odo` CLI tools to be used by code-ready-workspaces
It's currently hosted at `quay.io/jjanz/workshop-tools`
Per default you are logged in as the `ServiceAccount` of that namespace (e.g. `system:serviceaccount:user1-codeready:che-workspace`). So make sure to login with your personal user when opening the terminal for the first time

`oc login --insecure-skip-tls-verify https://${KUBERNETES_SERVICE_HOST} -u userX -p r3dh4t1!`

