# Het project opstarten
![Heroku](http://heroku-badge.herokuapp.com/?app=mvo-fluvius&root=api)

## Online versie
Deze API draait online via heroku op `https://mvo-fluvius.herokuapp.com/api/`

Voor een JWT token te ontvangen stuurt men een `POST` inlog request naar `https://mvo-fluvius.herokuapp.com/api/users/login` met volgende body:
```
{"GEBRUIKERSNAAM":"JanJansens", "WACHTWOORD":"123456789"}
```

Ook kan de online versie geraadpleegt worden via de [frontend op Netlify](https://mvo-fluvius.netlify.app/).
## Lokale versie

Voor een lokale versie van de API voert men na het clonen van de repository eerst volgend commando uit om alle packages te intaleren:
```
yarn install
```

Ook zal men een `mySQL database` nodig hebben en een `.env` file die er als volgt moet uitzien:

```
...
```


Indien de vorige stappen goed uitgevoert zijn kan men een lokale versie draaien via:
```
yarn start
```

De API draait nu op [http://localhost:9000](http://localhost:9000) en kan in de browser bekeken worden.

Ook hier kan men toegang krijgen via dezelfde inlog gegevens als de online versie.

### Testen
De testen kunnen uitgevoert worden via:
```
yarn test
```