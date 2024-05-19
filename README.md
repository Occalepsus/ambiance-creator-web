AmbianceCreator is a web server used to display images and create ambiances.

# How to use
## Get the project

To clone the project, go to the directory and enter in a terminal:
```
mkdir ambianceCreator
cd ambianceCreator
git clone https://github.com/Occalepsus/ambiance-creator-web.git
```
> You can also download an ZIP archive file of this projet. Click on the "Code" button at the top of the page and click "Download ZIP". You can the extract this ZIP file to the desired location.

## Download Node.js and the dependancies

Download Node.js and follow the installer instructions : https://nodejs.org/en/download/package-manager

Then go to the `ambianceCreator` directory, and enter in a terminal to install all the necessary dependancies:
```
npm install
```

## Launch the server

Go to the `ambianceCreator` directory, and enter in a terminal:
```
npm run dev
```

## Access the AmbianceCreator client

- If you are on the server machine, you can open that link: http://localhost:3000
- If you are on a machine connected to the local network, follow those steps:
  - First get the server ip address by typing the command on the server machine:
    - On Windows, `ipconfig`
    - On Linux, `ip addr`
  - Then on the client machine, you can open that link: http://{server-ip}:3000
 
# Contribute to the project

There are some ways to help the project development:

#### Report bugs and propose new features

To do that, you can open an issue in the "issues" tab.
Please prefix the issue title with [BUG] or [FEAT] to let me know if it is an issue or a feature proposal.

#### Code contribution

To contribute to the code, you can create a fork of that project and open a pull request to merge your modifications.
