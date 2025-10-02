import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as Location from "expo-location";

// 👉 substitua pelas coordenadas reais da igreja
const IGREJA = { lat: -22.912, lon: -43.209 };

function distanciaMetros(a, b) {
  const R = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export default function LocalizacaoCheckin({ raio = 120, onConfirmar }) {
  const [permissaoOk, setPermissaoOk] = useState(null);
  const [dist, setDist] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const ok = status === "granted";
      setPermissaoOk(ok);
      if (ok) {
        const pos = await Location.getCurrentPositionAsync({});
        const d = distanciaMetros(
          { lat: pos.coords.latitude, lon: pos.coords.longitude },
          IGREJA
        );
        setDist(Math.round(d));
      }
    })();
  }, []);

  if (permissaoOk === null) return <Text>Checando permissão de localização…</Text>;
  if (permissaoOk === false) return <Text>Sem acesso à localização.</Text>;
  if (dist == null) return <Text>Calculando distância…</Text>;

  const dentro = dist <= raio;

  return (
    <View style={{ gap: 8, alignItems: "flex-start" }}>
      <Text>Você está a ~{dist}m da GUIA Church.</Text>
      <Button
        title={dentro ? "Fazer check-in" : `Fora do raio de ${raio}m`}
        disabled={!dentro}
        onPress={() => {
          onConfirmar?.(dist);
          Alert.alert("Check-in confirmado!", "Boa celebração 🙌");
          // opcional: gravar check-in no Supabase
        }}
      />
    </View>
  );
}
