#!/bin/bash


# Change the current directory to the script directory
pushd $(dirname $0) > /dev/null

echo -e "${green} 1) Instalando cURL ${reset}"
sudo apt-get install curl

echo -e "${green} 2) Instalando NVM no WSL ${reset}"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

echo -e "${green} 3) Instalando Node v20.10 ${reset}"
nvm install 20.10

echo -e "${green} 4) Instalando as dependências do React ${reset}"
cd ../front
npm install
 
echo -e "${green} \n Pronto! ${reset}"


# Return to the previous directory
popd > /dev/null