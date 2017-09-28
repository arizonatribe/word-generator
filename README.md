# Word-Generator

Randomly generators a noun, verb, adjective and adverb into a sentence that you can used to help name complicated software releases.

## Depedencies

Docker and Docker-Compose are required to run this application, which are packaged together for Mac and Windows users into [Docker Toolbox](https://www.docker.com/products/docker-toolbox). _Note_: Docker is now available natively for Mac, so you can [install Docker natively](https://docs.docker.com/docker-for-mac/). For Linux users, follow the instructions for installing the [Docker Engine](https://docs.docker.com/engine/installation/) and [Docker Compose](https://docs.docker.com/compose/install/).

## Instructions

From the project root, issue the following command: 

```bash
make docker 
```

This command runs the `docker` target defined in this project's `Makefile`, however all that is doing is issuing the `docker build . . .` command which is a more lengthy command to type from your command-line (defining a `make` target like that is often done _just_ to shorcut lengthy commands like that).

After this is completed, the image will have been built and you can launch a container:

```bash
docker run --name=word-generator -v $PWD/data:/data -p 5000:5000 word-generator
```

That builds a container named "word-generator" from the image you just created, exposing port 5000 at which to make HTTP GET requests. It also (by default) maps this project's local `data/` directory to the reserved `/data` volume inside the container. The project's local `data/words.json` is a seed file to get you started, but if you want to just follow its formatting to create your own you can mount a directory containing your own custom file instead.

Also, you can shortcut _that_ command even further by defining a `docker-compose.yml` file. This project contains such a file with the same configuration parameters in config file format. So that same command can now be executed with the following command:

```bash
docker-compose up
```

You can even shortcut that process, using the `docker-compose` to build the image _and_ to build the container. Because the `docker-compose.yml` file defines a `build:` property - pointing to the location of this application's `Dockerfile` - you can execute the command `docker-compose build` from this directory and it will run the `docker build ...` command to rebuild the image (which is something you want to do every time you make changes to your source files or add new dependencies to the project).

And now to make _everything_ you just read absurdly simple, you can combine the image building and container building & launching process into one command:

```bash
docker-compose up --build -d
```

__NOTE__: The `-d` flag at the end launches the container in the background, so you don't surrender you shell over to the container's stdout. If you'd rather see that output, just omit the `-d` flag.

### Volumes

The JSON file that contains the words used to generate output is inside a local directory `./data` that is mounted to the container's `/data` volume. That file is an example, however you can add more words to it, or even add more files into that volume (Note that the python scripts look for that example file, and you would need to change that script if you add new files that you want to use instead).

Also, if you plan to jump into the container a lot (you use the command `docker exec -it word-generator /bin/bash` to get a shell inside the container), you might want to mount your `~/.bashrc` or `~/.profile` or `~/.vimrc` files so that interacting with the container is more familiar. To do so, you can modify the `volumes:` section of the `docker-compose.yml` to mount additional files and/or folders:

```yml
    volumes:
      - ~/.bashrc:/root/.bashrc
      - ~/.vimrc:/root/.vimrc
      - ~/.vim:/root/.vim
```

## Using the Application

You can explore the API endpoints at [http://localhost:5000/](http://locahost:5000/)

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
