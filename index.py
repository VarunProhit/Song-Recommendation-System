import cgi
from random import randrange

def notfound(environ,start_response):
    start_response('404 Not Found',[('Content-type')])
    return[b'404 Not Found']

class PathDispatcher:

    def __init__(self):
        self.pathmap={}

    def __call__(self,environ,start_response):
        path = environ['PATH_INFO']
        params = cgi.FieldStorage(environ['wsgi.input'],environ=environ)
        method = environ['REQUEST_METHOD'].lower()
        environ['params'] = {k:params.getvalue(k) for k in params}
        handler = self.pathmap.get((method,path),notfound)
        return handler(environ,start_response)

    def register(self,method,path,function):
        self.pathmap[method.lower(),path] = function
        return function

text_response = """<html>
    <head>
        <title>{text}</title>
    </head>
    <body>
        <h1>Here's what I got from params</h1>
        <p>
            {text}
        </p>
    </body>
</html>"""

def text(environ,start_response):
    start_response('200 OK',[('Content-type','application/json')])
    params = environ['params']
    emotions=["joy", "sadness", "anger", "fear", "surprise", "love"]
    # response = text_response.format(text=params.get('text'))
    response = emotions[randrange(0,6)]
    print(params.get('text'),response)
    yield response.encode('utf-8')

if __name__ == '__main__':
    from wsgiref.simple_server import make_server

    dispatcher = PathDispatcher()
    dispatcher.register('GET','/text',text)
    httpd = make_server('localhost',8080,dispatcher)
    print('Serving on port 8080...')
    httpd.serve_forever()