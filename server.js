const express = require('express');
const axios = require('axios'); 

const app = express();
const PORT = 3000; 

//possible urls
const numberApiUrls = {
  p: 'http://20.244.56.144/test/primes',
  e: 'http://20.244.56.144/test/even',
  f: 'http://20.244.56.144/test/fibo'
};

//state management of prev and curr
const dataWindows = {
  p: { previous: [], current: [] },
  e: { previous: [], current: [] },
  f: { previous: [], current: [] }
};

//calculate avg
const computeAverage = (numbers) => {
  const sum = numbers.reduce((accumulator, number) => accumulator + number, 0);
  return numbers.length > 0 ? sum / numbers.length : 0;
};

//route handling based on parameter
app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params; 

 
  if (!numberApiUrls[type]) {
    return res.status(404).send('Invalid type. Valid types are "primes", "evens", "fibonacci".');
  }

  try {
    //making api call for 20.244.56.144/test 
    const apiResponse = await axios.get(numberApiUrls[type], {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxODg5MTgyLCJpYXQiOjE3MjE4ODg4ODIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijg4YTgyNTY3LWRiNzAtNGRiOS05M2U4LTEwZGU0YTBjNTE2NyIsInN1YiI6ImIyMWNzODZAa2l0c3cuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJhZmZvcmRtZWQiLCJjbGllbnRJRCI6Ijg4YTgyNTY3LWRiNzAtNGRiOS05M2U4LTEwZGU0YTBjNTE2NyIsImNsaWVudFNlY3JldCI6Im1uRlFHTnl4eGNOTnlLaUIiLCJvd25lck5hbWUiOiJib2xsYW0gcHJhbmF5Iiwib3duZXJFbWFpbCI6ImIyMWNzODZAa2l0c3cuYWMuaW4iLCJyb2xsTm8iOiJiMjFjczA4OCJ9.QKsnn8YOYDDXVcmzkyhrK4azolqSuZCRzlC3e_skIdg'
      }
    });

    const numberList = apiResponse.data.numbers || []; //extraction of response

    const maxWindowSize = 10; //maximum window size as mentioned

    //update the windows
    const dataWindow = dataWindows[type];
    dataWindow.previous = dataWindow.current;
    dataWindow.current = numberList.slice(0, maxWindowSize);

    //check window size
    if (dataWindow.current.length < maxWindowSize) {
      const average = computeAverage(dataWindow.current); //calculate avg if size is less than 10
      return res.json({ 
        currentWindow: dataWindow.current, 
        previousWindow: dataWindow.previous, 
        average: average 
      });
    }

    //if no average is calculated just return the windows
    res.json({ 
      currentWindow: dataWindow.current, 
      previousWindow: dataWindow.previous 
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

//started server on port 3000
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
