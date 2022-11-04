from random import randrange
import argparse
import numpy as np
import pandas as pd
import tensorflow as tf


parser = argparse.ArgumentParser()
parser.add_argument('--text', type=str, required=True)
args = parser.parse_args()

# globals
NUM_WORDS = 1000
EMBEDDING_DIM = 16
MAXLEN = 120
PADDING = 'post'
OOV_TOKEN = "<OOV>"
TRAINING_SPLIT = .8

# data load
df = pd.read_csv("emtions.csv")
tweets = df['text']
labels = df['emotions']


def train_val_split(sentences, labels, training_split):
    train_size = int(len(sentences) * training_split)
    train_sentences = sentences[:train_size]
    train_labels = labels[:train_size]
    validation_sentences = sentences[train_size:]
    validation_labels = labels[train_size:]
    return train_sentences, validation_sentences, train_labels, validation_labels


train_sentences, val_sentences, train_labels, val_labels = train_val_split(tweets, labels, TRAINING_SPLIT)

def fit_tokenizer(train_sentences, num_words, oov_token):
    # Instantiate the Tokenizer class, passing in the correct values for num_words and oov_token
    tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=num_words, oov_token=oov_token)
    # Fit the tokenizer to the training sentences
    tokenizer.fit_on_texts(train_sentences)
    return tokenizer


tokenizer = fit_tokenizer(train_sentences, NUM_WORDS, OOV_TOKEN)
word_index = tokenizer.word_index


def seq_and_pad(sentences, tokenizer, padding, maxlen):
    # Convert sentences to sequences

    sequences = tokenizer.texts_to_sequences(sentences)
    # Pad the sequences using the correct padding and maxlen
    padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, padding=padding, maxlen=maxlen)
    return padded_sequences


model1 = tf.keras.models.load_model('tweet_emotion_model_g.h5')


def prediction(text):
    # Use a breakpoint in the code line below to debug your script.
    x = [text]
    x_padded_seq = seq_and_pad(x, tokenizer, PADDING, MAXLEN)
    y = np.argmax(model1.predict(x_padded_seq))
    # print(y)
    return(y)
if __name__ == '__main__':
    input_text=args.text
    formatted_text=input_text.replace('_',' ')
    y = prediction(formatted_text)
    emotions=["joy", "sadness", "anger", "fear","love" ,"surprise"]
    response = emotions[y]
    # print(y)
    print(response)

    # joy:0,sadness:1,anger:2, fear:3, love:4,surprise:5