from random import randrange
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--text', type=str, required=True)
args = parser.parse_args()

if __name__ == '__main__':
    input_text=args.text
    formatted_text=input_text.replace('_',' ')
    emotions=["joy", "sadness", "anger", "fear", "surprise", "love"]
    response = emotions[randrange(0,6)]
    print(response)