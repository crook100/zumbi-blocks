#pragma strict

function OnDestroy () {
    networkView.RPC("killmebuffered",RPCMode.AllBuffered);
}