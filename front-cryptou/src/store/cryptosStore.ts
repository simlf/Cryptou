// store/cryptos.ts
import { defineStore } from 'pinia';
import axios from 'axios';

export const useCryptoStore = defineStore('cryptos', {
    state: () => ({
        cryptocurrencyNames: []
    }),
    actions: {
        async fetchCryptos() {
            try {
                const response = await axios.get('http://localhost:3000/cryptos');
                // Map over the response data to extract only the fullName of each cryptocurrency
                this.cryptocurrencyNames = response.data.map((crypto: { cryptoName: string, id: string }) => ({name: crypto.cryptoName, id: crypto.id}));
            } catch (error) {
                console.error('There was a problem with the Axios operation:', error);
            }
        }
    }
});