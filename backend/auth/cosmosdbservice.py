from azure.cosmos.aio import CosmosClient
from azure.cosmos import exceptions
from datetime import datetime
import uuid

class CosmosLoginClient():

    def __init__(self, cosmosdb_endpoint: str, credential: any, database_name: str, container_name: str, enable_message_feedback: bool = False):
        self.cosmosdb_endpoint = cosmosdb_endpoint
        self.credential = credential
        self.database_name = database_name
        self.container_name = container_name
        self.enable_message_feedback = enable_message_feedback
        try:
            self.cosmosdb_client = CosmosClient(self.cosmosdb_endpoint, credential=credential)
        except exceptions.CosmosHttpResponseError as e:
            if e.status_code == 401:
                raise ValueError("Invalid credentials") from e
            else:
                raise ValueError("Invalid CosmosDB endpoint") from e

        try:
            self.database_client = self.cosmosdb_client.get_database_client(database_name)
        except exceptions.CosmosResourceNotFoundError:
            raise ValueError("Invalid CosmosDB database name") 
        
        try:
            self.container_client = self.database_client.get_container_client(container_name)
        except exceptions.CosmosResourceNotFoundError:
            raise ValueError("Invalid CosmosDB container name") 
        
    async def get_user(self, user_id):
        parameters = [
            {
                'name': '@userId',
                'value': user_id
            }
        ]
        query = f"SELECT * FROM c where c.userId = @userId"
        resp = self.container_client.query_items(query=query, parameters=parameters)

        ## if no user are found, return None
        if resp:
            return resp
        else:
            return None
    
    async def signup_user(self, email, password):
        user_id = str(uuid.uuid3(uuid.NAMESPACE_DNS, email))
        exist = await self.get_user(user_id)
        if exist != None:
            return False, "user already existed"

        user = {
            'id': str(uuid.uuid4()),  
            'type': 'user',
            'createdAt': datetime.utcnow().isoformat(),  
            'updatedAt': datetime.utcnow().isoformat(),  
            'userId': user_id,
            'email':email,
            'password':password
        }
        ## TODO: add some error handling based on the output of the upsert_item call
        resp = await self.container_client.upsert_item(user)  
        if resp:
            return resp, user_id
        else:
            return False, ""
        
    
        
    