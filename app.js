const { Duffel } = require('@duffel/api');

// Inserisci qui il tuo token di Duffel (da prendere nella dashboard sviluppatori)
const duffel = new Duffel({
  token: 'YOUR_DUFFEL_ACCESS_TOKEN'
});

async function searchFanFlights(matchName, originCity) {
  // 1. Trova i dati della partita
  const match = matchDatabase.find(m => m.teams.toLowerCase() === matchName.toLowerCase());
  if (!match) return "Partita non trovata";

  // 2. Prendi gli aeroporti di partenza (Genova e limitrofi)
  const departureAirports = nearbyAirports[originCity] || [originCity];

  console.log(`Cercando voli per ${match.teams} a ${match.city}...`);

  // 3. Crea le richieste di offerta per ogni aeroporto vicino
  const searchPromises = departureAirports.map(airport => {
    return duffel.offerRequests.create({
      slices: [
        {
          origin: airport,
          destination: match.airportCode,
          departure_date: match.date,
        },
      ],
      passengers: [{ type: 'adult' }],
      cabin_class: 'economy',
    });
  });

  const results = await Promise.all(searchPromises);
  
  // Elabora i risultati per trovare il "Più Conveniente"
  // Qui aggiungeresti la logica per ordinare per prezzo
  return results;
}
