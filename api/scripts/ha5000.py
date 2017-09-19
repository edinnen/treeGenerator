import os
import nltk
import sys
from nltk.chunk import *
from nltk.chunk.util import *
from nltk.chunk.regexp import *
from nltk import Tree
from nltk.tag import StanfordPOSTagger
from nltk import word_tokenize
from pylatex.base_classes import Environment, CommandBase, Arguments
from pylatex.package import Package
from pylatex import Document, Section, UnsafeCommand
from pylatex.utils import NoEscape
import uuid
from subprocess import call
import base64

jar = './jars/stanford-postagger.jar'
model = './jars/english-left3words-distsim.tagger'

pos_tagger = StanfordPOSTagger(model, jar, encoding='utf8')

userin = raw_input("Feed me language!: ")
if len(sys.argv) < 2:
    print("Error: Please specify a sentence")
else:
    userin = str(sys.argv[1])

sentence = pos_tagger.tag(word_tokenize(str(userin)))

parser = RegexpParser('''
ADJ: {<JJ>} #Adj -> 'JJ'
ADJP: {<ADJ>} #AdjP -> 'Adj'
N: {<NN.*>} #N -> 'NN'
V: {<V.*>} #V -> 'VBZ'
D: {<DT>*<PRP>*} #Det -> 'DT'
NP: {<ADJP>?<N>} #NP -> Adj N
D\': {<D>} #D' -> 'D'
DP: {<D\'>*<NP>?} #DP -> Det NP | Det
P: {(<TO>|<IN>)<PP>*}
P\': {(<P\'>(<PP>)*)|(<P>(<DP>)*)|(<P>(<VP>)*)}
PP: {(<P\'>)<DP>*<VP>*}
VP: {<V><DP>*<ADJP>*<PP>*} #VP -> V DP
''')

tree = parser.parse(sentence)

doc = Document()
doc.packages.append(Package('tikz'))
doc.packages.append(Package(NoEscape('tikz-qtree')))
doc.append(NoEscape('\\pagenumbering{gobble}'))
doc.append(NoEscape('\\begin{tikzpicture}[scale=0.9, sibling distance=1pt, level distance=40pt]'))
doc.append(NoEscape(' '.join(str(tree.pformat_latex_qtree()).split())))
doc.append(NoEscape('\end{tikzpicture}'))
unique_name = str(uuid.uuid4())
doc.generate_pdf('api/structures/' + unique_name)
location = 'api/structures/' + unique_name + '.pdf'
destination = 'api/structures/' + unique_name + '.png'
call(["convert", "-trim", "+repage", "-density", "96", "-quality", "85", location, destination])
call(["rm", location])
#print(destination)
print(base64.b64encode(open(destination, "rb").read()))
call(["rm", destination])

#print("\n")
#print(str(tree.pformat_latex_qtree()).split())
#print("\n")
#print(sentence)
#tree.draw()
