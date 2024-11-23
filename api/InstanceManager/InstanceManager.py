from api.InstanceManager.ClientIds import ClientIds, ClientWebSocket


class InastanceManager:
    clientIds: ClientIds
    clientWs: ClientWebSocket
    def __init__(self):
        self.clientIds = ClientIds()
        self.clientWs = ClientWebSocket()


    