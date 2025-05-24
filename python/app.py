from flask import Flask, request, jsonify
import string
from flask_cors import CORS
import nltk
import requests
from nltk.corpus import stopwords,wordnet
import re

nltk.download('stopwords')
nltk.download("omw-1.4")
nltk.download("wordnet")
nltk.download("wordnet_ic")

app = Flask(__name__)
CORS(app)
def encontrar_sinonimos(palavra):
    sinonimos = set()
    for synset in wordnet.synsets(palavra, lang="por"):  # Busca em português
        for lemma in synset.lemmas(lang="por"):
            sinonimos.add(lemma.name())
    return list(sinonimos)

@app.route('/limpar', methods=['POST'])
def limpar():
    #Removendo pontuações
    dados = request.json
    pesquisa = dados.get('texto', '')
    pesquisa = pesquisa.translate(str.maketrans('', '', string.punctuation))

    palavras = pesquisa.split()
    stop_words = set(stopwords.words('portuguese'))
    palavras_filtradas = [palavra for palavra in palavras if palavra.lower() not in stop_words]
    palavras_final = []
    
    for palavra in palavras_filtradas:
        sinonimos = encontrar_sinonimos(palavra)
        for sinonimo in sinonimos:
            sinonimo = sinonimo.replace("_", " ")
            partes = sinonimo.split()
            for parte in partes:
                if parte not in stop_words:
                    palavras_final.append(parte.lower())
        if palavra not in stop_words:
            palavras_final.append(palavra)
    
    palavras_final = list(dict.fromkeys(palavras_final))
 
    return jsonify({'palavras': palavras_final})

@app.route('/consultar_cnpj', methods=['GET'])
def consultar_cnpj():
    cnpj = request.args.get('cnpj')
    if cnpj:
        numeros = re.findall(r'\d', cnpj)  # Encontra todos os dígitos
        cnpj = "".join(numeros)
        url = f'https://www.receitaws.com.br/v1/cnpj/{cnpj}'
        response = requests.get(url)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'CNPJ não encontrado'}), 404
    return jsonify({'error': 'CNPJ inválido'}), 400

if __name__ == '__main__':
    app.run(debug=True)

