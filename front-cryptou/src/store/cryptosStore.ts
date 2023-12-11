// store/cryptos.ts
import { defineStore } from 'pinia';
import axios from 'axios';

export const useCryptoStore = defineStore('cryptos', {
    state: () => ({
        cryptocurrencies: []
    }),
    actions: {
        async fetchCryptos() {
            try {
                const response = await axios.get('http://localhost:3000/cryptos');
                this.cryptocurrencies = response.data;
            } catch (error) {
                console.error('There was a problem with the Axios operation:', error);
            }
        }
    }
});
