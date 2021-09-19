# Team Hackatomici - Download Innovation Hackaton 2021

## Getting started

Il progetto è composto da due parti, un'app mobile (Android e iOS) scritta in React Native ed un backend PHP basato sul framework Lumen.

## Local setup

### Backend

#### Requirements
- [Docker](https://www.docker.com/)
- Un token Google, per utilizzare le Places API
- Una key Firebase, per l'autenticazione e l'invio delle notifiche

#### Installation
- `cd` in _/backend_
- Creare il `.env` con `cp .env.example .env` e compilarlo con tutte le variabili d'ambiente necessarie
- Incollare il file `hackatomici-2021-firebase.json` in _/backend_
- Avviare i container con `docker-compose up -d`
- Il backend è raggiungibile all'indirizzo _localhost:80_

### Mobile app
> NB: Tutte le istruzioni nel file README.md sono relative a macOS. Per riprodurre questo tutorial su un sistema operativo differente, è necessario cercare i package di dipendenza e la relativa installazione.

#### Requirements

Per poter eseguire il progetto, è necessario installare `node` e `watchman`.

    brew install node
    brew install watchman

Un'altra dipendenza è Xcode. È possibile scaricarlo da [Apple](https://developer.apple.com/xcode/downloads/).

L'ultima dipendenza è CocoaPods. È possibile installarlo con:

    sudo gem install cocoapods

Una volta installate le dipendenze, entrare nella cartella del progetto e scaricare i node_modules con:

    // using npm
    npm install
    // using yarn
    yarn

##### Android

Per lanciare l'app su Android è sufficiente eseguire il comando:

    // using npm
    npx react-native run-android
    // using yarn
    yarn android

##### iOS

Prima di lanciare l'app su iOS bisogna assicurarsi di aver installato CocoaPods.
Con CocoaPods installato, lanciare il seguente comando per scaricare i Pods necessari:

    cd ios && pod install && cd ..

Per lanciare l'app su iOS eseguire il comando:

    // using npm
    npx react-native run-ios
    // using yarn
    yarn ios