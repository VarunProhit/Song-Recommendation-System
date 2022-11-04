# import http.server
# import socketserver
# import json

# name = "Arun"

# Handler = http.server.SimpleHTTPRequestHandler

# class myHandler(Handler):
#     def do_GET(self):
#         if self.path == '/':
#             self.path = json.dumps(name)
#         return http.server.SimpleHTTPRequestHandler.do_GET(self)

# PORT = 8000

# handler = myHandler
# myserver = socketserver.TCPServer(("", PORT), handler)
# myserver.serve_forever()

# print("serving at port", PORT)

import http.server
from random import randrange
import socketserver
import json

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
    
    def do_POST(self):
        # - request -
        content_length = int(self.headers['Content-Length'])
        print('content_length:', content_length)
        
        if content_length:
            input_json = self.rfile.read(content_length)
            input_data = json.loads(input_json)
        else:
            input_data = None
            
        emotions=["joy", "sadness", "anger", "fear", "surprise", "love"]
        print(input_data["text"])
        
        # - response -

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        output_data = {'status': 'OK', 'result': emotions[randrange(0,6)]}
        print(type(json.dumps(output_data)))
        output_json = json.dumps(output_data)
        
        self.wfile.write(output_json.encode('utf-8'))


Handler = MyHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Starting http://0.0.0.0:{PORT}")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("Stopping by Ctrl+C")
    httpd.server_close()