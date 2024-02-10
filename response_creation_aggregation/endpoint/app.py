from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from endpoint.research.chat import Chat

app = Flask(__name__)

CORS(app, supports_credentials=True)

@app.route("/ask", methods = ['POST'])
# @cross_origin(supports_credentials=True)
def ask():
    # request schema -> {'user_id': user_id,
    #                    'ask': user_ask}
    request_schema = request.get_json(force=True)

    chat = Chat(request_schema['user_id'], rounds = 5)

    response = chat.get_response(request_schema['ask'])

    response_schema = {
        'user_id': request_schema['user_id'],
        'response': response
    }

    response_schema_json = jsonify(response_schema)

    # response schema -> {'user_id':user_id, 'response': response}
    return response_schema_json
        
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000,)