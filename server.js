const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/compile-latex', async (req, res) => {
    const { latexCode } = req.body;
    try {
      console.log('Received LaTeX code for compilation');
      
      // Create a complete LaTeX document with the necessary packages
      const response = await axios.post('https://latex.ytotech.com/builds/sync', {
        compiler: 'pdflatex',
        resources: [{ main: true, content: latexCode, path: 'main.tex' }],
        // Specify that we want a full log for better error reporting
        options: {
          outputFormat: 'pdf',
          returnLog: true
        }
      }, { 
        responseType: 'json', // Change to JSON first to check for errors
        // Increase timeout for complex compilations
        timeout: 30000,
        validateStatus: function (status) {
          return true; // Accept all status codes to handle errors better
        }
      });
      
      // Check if there's an error in the response
      if (response.status !== 200 || response.data.error) {
        console.error('LaTeX compilation error:', response.data);
        
        // Extract error message from the response
        let errorMessage = 'Compilation failed';
        if (response.data && response.data.error) {
          errorMessage = response.data.error;
        }
        
        // If we have log data, try to extract more specific error information
        if (response.data && response.data.log) {
          const logLines = response.data.log.split('\n');
          const errorLines = logLines.filter(line => 
            line.includes('Error:') || 
            line.includes('!') && !line.includes('!====') && !line.includes('!=====')
          );
          
          if (errorLines.length > 0) {
            errorMessage = errorLines.join('\n');
          }
        }
        
        return res.status(400).json({ 
          message: errorMessage,
          log: response.data.log || 'No log available'
        });
      }
      
      // If we got here, we need to make another request to get the PDF
      const pdfResponse = await axios.post('https://latex.ytotech.com/builds/sync', {
        compiler: 'pdflatex',
        resources: [{ main: true, content: latexCode, path: 'main.tex' }],
        options: {
          outputFormat: 'pdf'
        }
      }, { 
        responseType: 'arraybuffer'
      });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfResponse.data);
      
    } catch (error) {
      console.error('Error compiling LaTeX:', error.message);
      
      // Provide more detailed error information
      let errorMessage = 'Compilation failed';
      let logData = '';
      
      if (error.response) {
        console.error('Error response status:', error.response.status);
        
        // Try to parse the error response
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data.substring(0, 500);
          } else if (Buffer.isBuffer(error.response.data)) {
            try {
              const dataStr = Buffer.from(error.response.data).toString('utf8');
              const jsonData = JSON.parse(dataStr);
              
              if (jsonData.error) {
                errorMessage = jsonData.error;
              }
              
              if (jsonData.log) {
                logData = jsonData.log;
                
                // Try to extract specific LaTeX errors from the log
                const logLines = jsonData.log.split('\n');
                const errorLines = logLines.filter(line => 
                  line.includes('Error:') || 
                  (line.includes('!') && !line.includes('!====') && !line.includes('!====='))
                );
                
                if (errorLines.length > 0) {
                  errorMessage = errorLines.join('\n');
                }
              }
            } catch (e) {
              // If we can't parse as JSON, just use the raw data
              errorMessage = 'Raw error: ' + Buffer.from(error.response.data).toString('utf8').substring(0, 500);
            }
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
            logData = error.response.data.log || '';
          }
        }
      } else if (error.request) {
        errorMessage = 'No response from LaTeX service. The service might be down or unreachable.';
      }
      
      res.status(500).json({ 
        message: errorMessage,
        log: logData,
        error: error.message 
      });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`)); 