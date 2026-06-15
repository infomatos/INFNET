
# GUIA Church (React Native + Expo + Supabase)

App mobile da GUIA Church para conteúdo, cursos e gestão leve.
Feito com Expo (RN) e Supabase (Auth, DB e Storage). Android/iOS.

✨ Funcionalidades
* Auth Supabase (e-mail/senha) + recuperação
* Perfis: Visitante · Membro · Admin
* Home com Hero, menu mobile e badge com avatar
* Minha Conta: editar Nome, Telefone, Endereço e Avatar (câmera/galeria)
* Cursos
* Listagem, criar/editar (admin), excluir via swipe
* Long press para editar (admin)
* Inscrição e progresso com háptico
* Pull-to-refresh
* Dashboard com KPIs e gráficos (Gifted Charts)
* Eventos e Ofertas (telas de navegação)
* Acessibilidade: labels em cards e gráficos

🧱 Stack
* React Native + Expo
* Navegação: @react-navigation/native + @react-navigation/native-stack
* Gestos: react-native-gesture-handler (Swipeable, LongPress)
* Supabase (Auth, Postgres, Storage)
* Mídia/UX: expo-image-picker, expo-haptics, expo-notifications
* Gráficos: react-native-gifted-charts + react-native-svg (+ expo-linear-gradient)
* Tema local: theme/COLORS
