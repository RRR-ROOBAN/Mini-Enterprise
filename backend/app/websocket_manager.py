from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):

        # Notification websocket

        self.active_connections = {}

        # Kanban websocket

        self.kanban_connections = []


    # ✅ Notification Connect

    async def connect(

        self,

        websocket: WebSocket,

        user_id: int

    ):

        await websocket.accept()

        old = self.active_connections.get(

            user_id

        )

        if old:

            try:

                await old.close()

            except:

                pass


        self.active_connections[

            user_id

        ] = websocket


        print(

            "Connected",

            user_id

        )


    # ✅ Kanban Connect

    async def connect_kanban(

        self,

        websocket: WebSocket

    ):

        await websocket.accept()

        self.kanban_connections.append(

            websocket

        )

        print(

            "Kanban Connected"

        )


    # ✅ Disconnect

    def disconnect(

        self,

        websocket,

        user_id

    ):

        current = (

            self.active_connections.get(

                user_id

            )

        )

        if current == websocket:

            del self.active_connections[

                user_id

            ]

        print(

            "Disconnected",

            user_id

        )


    # ✅ Kanban Disconnect

    def disconnect_kanban(

        self,

        websocket

    ):

        if (

            websocket

            in self.kanban_connections

        ):

            self.kanban_connections.remove(

                websocket

            )


    # ✅ Notification Send

    async def send_notification(

        self,

        user_id,

        message

    ):

        websocket = (

            self.active_connections.get(

                user_id

            )

        )

        if not websocket:

            return

        try:

            await websocket.send_json({

                "message":message

            })

        except:

            pass


    # ✅ Kanban Broadcast

    async def broadcast_kanban(

        self,

        task

    ):

        dead=[]

        for ws in self.kanban_connections:

            try:

                await ws.send_json({

                    "type":"kanban",

                    "task":task

                })

            except:

                dead.append(ws)


        for ws in dead:

            self.disconnect_kanban(

                ws

            )


manager = ConnectionManager()