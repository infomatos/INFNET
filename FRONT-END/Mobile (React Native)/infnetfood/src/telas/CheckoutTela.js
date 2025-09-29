import * as React from "react";
import {
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, ScrollView
} from "react-native";

const formatarPreco = (n) =>
  Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const TAXA_ENTREGA = 7.9; // mock

function LinhaItem({ item }) {
  return (
    <View style={estilos.itemLinha}>
      <Image source={{ uri: item.img }} style={estilos.itemImg} />
      <View style={{ flex: 1 }}>
        <Text style={estilos.itemNome}>{item.nome}</Text>
        <Text style={estilos.itemSub}>
          Qtd: {item.qty} • {formatarPreco(item.preco)} / un
        </Text>
      </View>
      <Text style={estilos.itemTotal}>{formatarPreco(item.preco * item.qty)}</Text>
    </View>
  );
}

export default function CheckoutTela({ carrinho, onConfirm }) {
  const subtotal = carrinho.reduce((s, i) => s + i.preco * i.qty, 0);
  const total = subtotal + (carrinho.length ? TAXA_ENTREGA : 0);

  const [form, setForm] = React.useState({
    nome: "Cliente Infnet",
    telefone: "(21) 99999-0000",
    endereco: "Rua Exemplo",
    numero: "123",
    bairro: "Centro",
    cidade: "Rio de Janeiro",
    cep: "20000-000",
    metodoPagamento: "pix"
  });
  const [erro, setErro] = React.useState("");

  // Overlay de sucesso
  const [okVisivel, setOkVisivel] = React.useState(false);
  const escala = React.useRef(new Animated.Value(0.8)).current;
  const op = React.useRef(new Animated.Value(0)).current;

  function set(k, v) { setForm((old) => ({ ...old, [k]: v })); }

  function validar() {
    const obrig = ["endereco", "numero", "bairro", "cidade", "cep", "metodoPagamento"];
    for (const k of obrig) {
      if (!String(form[k] ?? "").trim()) return `Preencha o campo obrigatório: ${k}.`;
    }
    if (carrinho.length === 0) return "Seu carrinho está vazio.";
    return "";
  }

  function animarOk(cb) {
    setOkVisivel(true);
    Animated.parallel([
      Animated.timing(op, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(escala, { toValue: 1, useNativeDriver: true })
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(op, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
          setOkVisivel(false);
          cb && cb();
        });
      }, 1000);
    });
  }

  function confirmar() {
    const msg = validar();
    if (msg) { setErro(msg); return; }
    setErro("");
    animarOk(() => onConfirm && onConfirm({ ...form, total, subtotal, taxa: TAXA_ENTREGA }));
  }

  if (carrinho.length === 0) {
    return (
      <View style={[estilos.container, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ fontSize: 16, opacity: 0.7, marginBottom: 12 }}>Seu carrinho está vazio.</Text>
        <Text style={{ opacity: 0.6 }}>Volte e adicione itens para continuar.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1 }}>
        {/* Overlay de sucesso */}
        {okVisivel && (
          <Animated.View style={[estilos.overlay, { opacity: op }]}>
            <Animated.View style={[estilos.okBalao, { transform: [{ scale: escala }] }]}>
              <Text style={estilos.okCheck}>✓</Text>
              <Text style={estilos.okMsg}>Pedido confirmado!</Text>
            </Animated.View>
          </Animated.View>
        )}

        {/* TUDO em UMA ScrollView → rola a página inteira, incluindo o botão */}
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 40, rowGap: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={estilos.titulo}>Revisar Pedido</Text>

          {/* Itens */}
          <View style={{ rowGap: 10 }}>
            {carrinho.map((item) => <LinhaItem key={item.id} item={item} />)}
          </View>

          {/* Totais */}
          <View style={estilos.caixa}>
            <Linha rotulo="Subtotal" valor={formatarPreco(subtotal)} />
            <Linha rotulo="Entrega" valor={formatarPreco(TAXA_ENTREGA)} />
            <View style={estilos.divisor} />
            <Linha rotulo="Total" valor={formatarPreco(total)} negrito grande />
          </View>

          {/* Endereço */}
          <Text style={estilos.secao}>Endereço de Entrega</Text>
          <View style={estilos.caixa}>
            <Campo label="Nome" value={form.nome} onChangeText={(v) => set("nome", v)} />
            <Campo label="Telefone" value={form.telefone} onChangeText={(v) => set("telefone", v)} keyboardType="phone-pad" />
            <Campo label="Endereço *" value={form.endereco} onChangeText={(v) => set("endereco", v)} />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Campo style={{ flex: 1 }} label="Número *" value={form.numero} onChangeText={(v) => set("numero", v)} keyboardType="numeric" />
              <Campo style={{ flex: 2 }} label="Bairro *" value={form.bairro} onChangeText={(v) => set("bairro", v)} />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Campo style={{ flex: 2 }} label="Cidade *" value={form.cidade} onChangeText={(v) => set("cidade", v)} />
              <Campo style={{ flex: 1 }} label="CEP *" value={form.cep} onChangeText={(v) => set("cep", v)} keyboardType="numbers-and-punctuation" />
            </View>
          </View>

          {/* Pagamento */}
          <Text style={estilos.secao}>Método de Pagamento</Text>
          <View style={[estilos.caixa, { flexDirection: "row", gap: 8 }]}>
            <BotaoPagamento label="PIX"     ativo={form.metodoPagamento === "pix"}     onPress={() => set("metodoPagamento", "pix")} />
            <BotaoPagamento label="Cartão"  ativo={form.metodoPagamento === "cartao"}  onPress={() => set("metodoPagamento", "cartao")} />
            <BotaoPagamento label="Dinheiro"ativo={form.metodoPagamento === "dinheiro"}onPress={() => set("metodoPagamento", "dinheiro")} />
          </View>

          {!!erro && <Text style={estilos.erro}>{erro}</Text>}

          {/* Botão agora faz parte da ScrollView → sempre alcançável */}
          <TouchableOpacity style={estilos.btnConfirmar} onPress={confirmar}>
            <Text style={estilos.btnConfirmarTxt}>Confirmar Pedido</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ====== Subcomponentes ====== */
function Campo({ label, style, ...props }) {
  return (
    <View style={[{ marginBottom: 8 }, style]}>
      <Text style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>{label}</Text>
      <TextInput
        {...props}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, paddingHorizontal: 12, height: 44 }}
        placeholderTextColor="#999"
      />
    </View>
  );
}

function Linha({ rotulo, valor, negrito, grande }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
      <Text style={{ fontWeight: negrito ? "800" : "600", fontSize: grande ? 16 : 14 }}>{rotulo}</Text>
      <Text style={{ fontWeight: negrito ? "800" : "700", fontSize: grande ? 16 : 14 }}>{valor}</Text>
    </View>
  );
}

function BotaoPagamento({ label, ativo, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{
        flex: 1, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center",
        borderWidth: 1, borderColor: ativo ? "#ff4d4f" : "#ddd", backgroundColor: ativo ? "#ffebeC" : "#fff"
      }]}
    >
      <Text style={{ fontWeight: "800", color: ativo ? "#d9363e" : "#333" }}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ====== Estilos ====== */
const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  titulo: { fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 6 },
  caixa: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  secao: { fontSize: 16, fontWeight: "800", marginTop: 4, marginBottom: 6 },

  itemLinha: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  itemImg: { width: 60, height: 60, borderRadius: 8 },
  itemNome: { fontSize: 14, fontWeight: "700" },
  itemSub: { fontSize: 12, opacity: 0.7 },
  itemTotal: { fontSize: 14, fontWeight: "800" },

  divisor: { height: 1, backgroundColor: "#eee", marginVertical: 6 },

  erro: { color: "#d93025", textAlign: "center", marginTop: 4 },

  btnConfirmar: {
    marginTop: 6,
    backgroundColor: "#ff4d4f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  btnConfirmarTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },

  // Overlay de sucesso
  overlay: {
    position: "absolute",
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.25)",
    left: 0, right: 0, top: 0, bottom: 0,
    alignItems: "center", justifyContent: "center"
  },
  okBalao: {
    backgroundColor: "#1f7a4c",
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  okCheck: { color: "#fff", fontSize: 40, fontWeight: "900", lineHeight: 44 },
  okMsg: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 6 }
});
