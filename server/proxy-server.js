const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Enable CORS untuk semua route
app.use(cors());
app.use(express.json());

// Middleware untuk log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Journal Scraper Proxy Server is running!',
        endpoints: {
            proxy: 'GET /proxy?url=URL',
            bulkProxy: 'POST /bulk-proxy',
            health: 'GET /health'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Single URL proxy
app.get('/proxy', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            error: 'URL parameter is required',
            usage: '/proxy?url=ENCODED_URL'
        });
    }

    try {
        console.log(`🔗 Proxying: ${url}`);

        const response = await fetch(url, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();

        console.log(`✅ Success: ${url} (${html.length} bytes)`);
        res.send(html);

    } catch (error) {
        console.error(`❌ Proxy error for ${url}:`, error.message);
        res.status(500).json({
            error: 'Failed to fetch URL',
            details: error.message,
            url: url
        });
    }
});

// Bulk proxy for multiple URLs
app.post('/bulk-proxy', async (req, res) => {
    const { urls, delay = 1000 } = req.body;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({
            error: 'URLs array is required in request body'
        });
    }

    console.log(`📦 Bulk processing ${urls.length} URLs...`);

    const results = [];

    // Process URLs sequentially dengan delay
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];

        try {
            console.log(`[${i + 1}/${urls.length}] Fetching: ${url}`);

            const response = await fetch(url, {
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const html = response.ok ? await response.text() : null;

            results.push({
                url,
                html,
                success: response.ok,
                status: response.status,
                index: i
            });

            console.log(`[${i + 1}/${urls.length}] ${response.ok ? '✅' : '❌'} ${url}`);

        } catch (error) {
            console.error(`[${i + 1}/${urls.length}] ❌ Error: ${url} - ${error.message}`);
            results.push({
                url,
                html: null,
                success: false,
                error: error.message,
                index: i
            });
        }

        // Delay antara requests
        if (i < urls.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    res.json({
        total: urls.length,
        success: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: ['GET /proxy', 'POST /bulk-proxy', 'GET /health']
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 ==================================');
    console.log('🚀 Journal Scraper Proxy Server');
    console.log('🚀 ==================================');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log('🔗 Endpoints:');
    console.log('   GET  /proxy?url=URL');
    console.log('   POST /bulk-proxy');
    console.log('   GET  /health');
    console.log('====================================');
});