import { loginUser, registerUser } from "@/backend/api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const signin = async (email, password) => {
    try {
      const { token } = await loginUser(email, password);

      await AsyncStorage.setItem("token");
      setUserToken(token);
    } catch (error) {
      error;
    }
  };
  const signup = async (email, password) => {
    try {
      await registerUser(email, password);
    } catch (error) {
      error;
    }
  };
  const signout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUserToken(null);
    } catch (e) {
      console.log("Failed to sign out:", e);
    }
  };
  const restoreToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setUserToken(token);
      setLoading(false);
    } catch (error) {
      error;
    }
  };

  useEffect(() => {
    restoreToken();
  }, []);

  const contextData = {
    userToken,
    loading,
    signin,
    signup,
    signout,
    isAuthenticated: !!userToken,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <SafeAreaView>
          <Text>Loading...</Text>
        </SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };
