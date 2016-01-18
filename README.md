# word-generator

Randomly generators a noun, verb, adjective and adverb into a sentence that you can used to help name complicated software releases.

## Instructions

 * Install Docker 1.9+ [installation](https://docs.docker.com/engine/installation/) 
 * From the project root, issue the following command: 

```bash
make docker 
```

 * After this is completed, the image will have been built and you can launch a container:

```bash
docker-compose up
```
 * Now, you can explore the API endpoints at [http://localhost:5000/](http://locahost:5000/)
    *  [/words/v1/full](http://locahost:5000/words/v1/full) - _GET_ - Randomly generates a noun, verb, adjective and adverb into a single sentences
    *  [/words/v1/short](http://locahost:5000/words/v1/short) - _GET_ - Randomly generates a noun and adjective (no query string params accepted)
    *  [/words/v1/list](http://locahost:5000/words/v1/list) - _GET_ - Retrieves a list of the default words being used by the application (of each word type, too)
    *  [/words/v1/full?startsWith=w](http://locahost:5000/words/v1/full?startsWith=w) - _GET_ - Randomly generates a noun, verb, adjective and adverb all starting with the provided character(s)
    *  [/words/v1/full?noun=true&verb=true&adverb=true](http://locahost:5000/words/v1/full?noun=true&verb=true&adverb=true) - _GET_ - Randomly generates a noun, verb and adverb only (specify each word type you wish to include)
    *  [/words/v1/full](http://localhost:5000/words/v1/full) - _POST_ - Randomly generates a noun, verb, adjective and adverb, using any list words in the JSON you posted in place of the defaults. The JSON object should contain arrays labeled `nouns`, `verbs`, `adverbs`, and/or `adjectives` to be recognized and used to override the defaults lists.

### CLI

Additionally, there is a command-line utilty for much of the same functionality contained in the web API.

  * To use it, launch the docker container:

```bash
docker-compose up -d
docker exec -it word-generator /bin/bash
```

  * Then launch the parser:

```bash
python app/server/jsonParse.py
```

  * The options you can pass in are:
    * `-s=<starts with>` OR `--starts-with=<starts with>` - String or char to restrict the words with
    * `-n` OR `--noun` - Specifies that a noun should be included
    * `-v` OR `--verb` - Specifies that a verb should be included
    * `-b` OR `--adverb` - Specifies that a adverb should be included
    * `-j` OR `--adjective` - Specifies that a adjective should be included
  * _NOTE_: While the default is to generate one of each type of word into a sentence, if any of the `-n`, `-v`, `-b`, or `-j` options are included, the results will __only__ include the options you manually specify.
