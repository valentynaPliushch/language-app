import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";

const SigninScreen = () => {
  const { user, signin, signout, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signin(email, password);
    } catch (error) {
      alert("Login failed");
    }
  };
  return (
    <SafeAreaView>
      {isAuthenticated ? (
        <>
          <Text>Hello, {user.name}!</Text>
          <Button title="Sign out" onPress={signout} />
        </>
      ) : (
        <View>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SigninScreen;
