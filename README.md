## Overview

This project tracks covid vaccination progress in Illinois by region.

## Python Version

![screenshot of results](https://user-images.githubusercontent.com/74382969/116957112-a6c79b00-ac5c-11eb-8d65-26a69db9f6a1.png)

This section uses python with matplotlib in a Jupyter Notebook. It displays a graph of daily 1st and 2nd doses as well as running averages of each.

It takes user input to run the analysis for the state as a whole or for a specific county or the city of Chicago(shown in the screenshot above).

#### To Run

Run Illinois_Vaccination_Data_from_JSON.ipynb in Jupyter Notebook. When prompted, enter an illinois county or leave blank and hit return for statewide analysis.

## Javascript Version

In progress! This section currently displays daily 1st and 2nd doses as well as running averages of each, as well as total percent vaccinated over time. Data covers the city of Chicago and can be broken down by zip code with user input.

#### To Run

Run index.html with an http server.

## Data

Statewide daily vaccine data is from the [Illinois Department of Public Health](https://www.dph.illinois.gov/content/covid-19-vaccine-administration-data)
Chicago vaccine data by zip code is from the [city's data portal](https://data.cityofchicago.org/resource/553k-3xzc.json)
