# Description

This projet is my answer to the code challenge provided by Adaptive. 

It displays an UI allowing the user to : 
- see the current models under training (runs)
- pick some to plot on a token loss chart 
- zoom on this chart (using mousewheel, double click on chart to reset zoom to default)
- display tooltips 
- define arbitrary min / max on both axis 

# How to run 

From one's terminal, go to the directory containing this project and run : 
```
yarn install 
yarn start 
```

You should be automatically taken to your browser on (localhost:3001)[http://localhost:3001]

Don't forget to run backend first ! 

# How it was done

## Technical choices 

- React is used as a component library, project was built using [create react app](https://create-react-app.dev/)
- Theming is done using [emotion](https://emotion.sh/docs/introduction) 
- Subscribing to data update for each run is done manually. 
- Chart is drawn using the lib [scichart](https://www.scichart.com/javascript-chart-features/) which uses WebGL & WebAssembly to render charts, making it very efficient to plot charts with big data series. 

## Improvements made on the backend

- By default, the provided backend did not accept queries from other domain name, thus making it impossible to query from an auto served web application. Web application being served by the business backend is not such a popular pattern those days. So I had to change that using tower_http's CorsLayer. 
- The endpoint `run` was returning absolutely all its available data. Thus, models others than gpt_small would take forever to load it's first batch of data points (more than 1 minute for gpt_3b, with a payload of 12Mo). It was making testing hard, and more generally, was not ideal in term of user experience. I took the liberty to cap the amount of data points to 1000 data points in order to fix that. 
# Possible improvements 

## Use a proper data store 

Currently, the datastore is just some state at root level updated using a reducer. This store is passed as a parameter from root component to sub components. If we wanted to professionalize this product, we should use a proper datastore (such as Redux for instance) accessible from anywhere without having to pass it manually. 

## Use a linter

In order to make the code consistent from one file to another and make sure that conventions are shared by the whole team, it'd be best to use and parametrize a linter. I was into kind of a rush which prevented me from setting it.  

## Implement additional bonus features 

- scichart has a feature to plot dataserie on logarithmic axis. I intended to use it to enable user to switch between linear and logarithmic axis, but I was into some kind of rush and laked time to do it. 
- I also wanted to implement so feature to flag and filter outliers using derivative calculation but time was the limiting factor as well.

## Include wasm files on build

Currently wasm files are loaded from CDN, it'd be best to add them on build using a webpack config. Yet this is not so straightforward when using create react app which was the tool I used to bootstrap quickly the project and start coding features. If this project was to be professionalized, we should overcome this limitation. 

## Limit cross origin ressource sharing to web app's domain only

Currently backend accept queries from any domain name, it'd be best to limit that to the web app's domain only.

