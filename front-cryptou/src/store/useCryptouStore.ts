import { defineStore } from "pinia";
import axios from "axios";
import { User } from "@/types/userInterface";

export const useStore = defineStore("cryptos", {
  state: () => ({
    cryptocurrencyNames: [],
    user: {} as User,
  }),
  getters: {
    cryptoNameList: (state) => {
      return state.cryptocurrencyNames.map((crypto) => crypto.name);
    },
  },
  actions: {
    async fetchCryptos() {
      try {
        const response = await axios.get("http://localhost:3000/cryptos");
        // Map over the response data to extract only the fullName of each cryptocurrency
        this.cryptocurrencyNames = response.data.map(
          (crypto: { cryptoName: string; id: string }) => ({
            name: crypto.cryptoName,
            id: crypto.id,
          })
        );
      } catch (error) {
        console.error("There was a problem with the Axios operation:", error);
      }
    },
    async saveUser(
      email: string,
      role: number,
      crypto: string,
      keywords: string,
      currency: string,
      token: string
    ) {
      const cryptoArray = crypto.split(",");
      const keywordArray = keywords.split(",");
      const username = email.split("@")[0];
      this.user = {
        email,
        username,
        cryptoArray,
        keywordArray,
        currency,
        role,
        token,
      };

      const userData = {
        email: this.user.email,
        role: this.user.role,
        crypto: this.user.cryptoArray.join(","),
        keywords: this.user.keywordArray.join(","),
        currency: this.user.currency,
        token: this.user.token,
      };

      try {
        await axios.put("http://localhost:3000/users/profile", userData, {
          headers: {
            Authorization: `Bearer ${this.user.token}`,
          },
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      }
    },

    clearUser() {
      this.user = {} as User;
    },
  },
});
