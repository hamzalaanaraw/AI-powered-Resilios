/**
 * i18n module for multi-language support
 * Supports: English, Spanish, French, German, Portuguese, Japanese, Chinese
 */

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'zh';

export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ja: '日本語',
  zh: '中文',
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth & Navigation
    'auth.welcome': 'Welcome to Resilios',
    'auth.subtitle': 'Your AI-powered mental wellness companion',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.loginButton': 'Get Started',
    'auth.logoutButton': 'Logout',
    
    // Pricing
    'pricing.title': 'Choose Your Plan',
    'pricing.free': 'Free',
    'pricing.freeTier': '100 chats per day',
    'pricing.premium': 'Premium',
    'pricing.premiumPrice': '$4.99/month',
    'pricing.sevenDayTrial': '7-day free trial',
    'pricing.cardRequired': 'Card required',
    'pricing.features': 'Premium Features',
    'pricing.unlimitedChats': 'Unlimited chats',
    'pricing.deeperThinking': 'Deeper thinking responses',
    'pricing.videoAnalysis': 'Video analysis',
    'pricing.fullWellnessPlan': 'Full wellness plan',
    'pricing.priorityFeatures': 'Early access to new features',
    
    // Chat
    'chat.title': 'Chat with Resilios',
    'chat.messageInputPlaceholder': 'Type your message...',
    'chat.sendButton': 'Send',
    'chat.quotaExceeded': 'Daily chat limit reached (100 for free users)',
    'chat.upgradePrompt': 'Upgrade to Premium for unlimited chats',
    
    // Live Avatar
    'avatar.premium': 'Live Avatar',
    'avatar.premiumOnly': 'Premium feature',
    'avatar.subscribePrompt': 'Subscribe to use Live Avatar',
    'avatar.startConversation': 'Start Conversation',
    'avatar.stopConversation': 'Stop Conversation',
    
    // Buttons
    'button.subscribe': 'Subscribe Now',
    'button.viewPlans': 'View Plans',
    'button.startTrial': 'Start 7-Day Free Trial',
    'button.close': 'Close',
    'button.cancel': 'Cancel',
    
    // Wellness Features
    'wellness.checkIn': 'Daily Check-in',
    'wellness.mood': 'How are you feeling today?',
    'wellness.gratitude': 'Gratitude Practice',
    'wellness.goals': 'Wellness Goals',
  },
  
  es: {
    // Auth & Navigation
    'auth.welcome': 'Bienvenido a Resilios',
    'auth.subtitle': 'Tu compañero de bienestar mental potenciado por IA',
    'auth.emailPlaceholder': 'Ingresa tu correo',
    'auth.loginButton': 'Comenzar',
    'auth.logoutButton': 'Cerrar sesión',
    
    // Pricing
    'pricing.title': 'Elige tu Plan',
    'pricing.free': 'Gratis',
    'pricing.freeTier': '100 chats por día',
    'pricing.premium': 'Premium',
    'pricing.premiumPrice': '$4.99/mes',
    'pricing.sevenDayTrial': 'Prueba gratuita de 7 días',
    'pricing.cardRequired': 'Se requiere tarjeta',
    'pricing.features': 'Características Premium',
    'pricing.unlimitedChats': 'Chats ilimitados',
    'pricing.deeperThinking': 'Respuestas más profundas',
    'pricing.videoAnalysis': 'Análisis de video',
    'pricing.fullWellnessPlan': 'Plan de bienestar completo',
    'pricing.priorityFeatures': 'Acceso anticipado a nuevas funciones',
    
    // Chat
    'chat.title': 'Conversa con Resilios',
    'chat.messageInputPlaceholder': 'Escribe tu mensaje...',
    'chat.sendButton': 'Enviar',
    'chat.quotaExceeded': 'Límite diario de chats alcanzado (100 para usuarios gratis)',
    'chat.upgradePrompt': 'Actualiza a Premium para chats ilimitados',
    
    // Live Avatar
    'avatar.premium': 'Avatar en Vivo',
    'avatar.premiumOnly': 'Función premium',
    'avatar.subscribePrompt': 'Suscríbete para usar Avatar en Vivo',
    'avatar.startConversation': 'Comenzar Conversación',
    'avatar.stopConversation': 'Detener Conversación',
    
    // Buttons
    'button.subscribe': 'Suscribirse Ahora',
    'button.viewPlans': 'Ver Planes',
    'button.startTrial': 'Comenzar Prueba Gratuita de 7 Días',
    'button.close': 'Cerrar',
    'button.cancel': 'Cancelar',
    
    // Wellness Features
    'wellness.checkIn': 'Chequeo Diario',
    'wellness.mood': '¿Cómo te sientes hoy?',
    'wellness.gratitude': 'Práctica de Gratitud',
    'wellness.goals': 'Objetivos de Bienestar',
  },
  
  fr: {
    // Auth & Navigation
    'auth.welcome': 'Bienvenue sur Resilios',
    'auth.subtitle': 'Votre compagnon de bien-être mental alimenté par l\'IA',
    'auth.emailPlaceholder': 'Entrez votre e-mail',
    'auth.loginButton': 'Commencer',
    'auth.logoutButton': 'Se déconnecter',
    
    // Pricing
    'pricing.title': 'Choisissez Votre Plan',
    'pricing.free': 'Gratuit',
    'pricing.freeTier': '100 chats par jour',
    'pricing.premium': 'Premium',
    'pricing.premiumPrice': '$4,99/mois',
    'pricing.sevenDayTrial': 'Essai gratuit de 7 jours',
    'pricing.cardRequired': 'Carte requise',
    'pricing.features': 'Fonctionnalités Premium',
    'pricing.unlimitedChats': 'Chats illimités',
    'pricing.deeperThinking': 'Réponses plus approfondies',
    'pricing.videoAnalysis': 'Analyse vidéo',
    'pricing.fullWellnessPlan': 'Plan de bien-être complet',
    'pricing.priorityFeatures': 'Accès anticipé aux nouvelles fonctionnalités',
    
    // Chat
    'chat.title': 'Discutez avec Resilios',
    'chat.messageInputPlaceholder': 'Tapez votre message...',
    'chat.sendButton': 'Envoyer',
    'chat.quotaExceeded': 'Limite de chats quotidienne atteinte (100 pour les utilisateurs gratuits)',
    'chat.upgradePrompt': 'Passez à Premium pour des chats illimités',
    
    // Live Avatar
    'avatar.premium': 'Avatar en Direct',
    'avatar.premiumOnly': 'Fonctionnalité premium',
    'avatar.subscribePrompt': 'Abonnez-vous pour utiliser Avatar en Direct',
    'avatar.startConversation': 'Démarrer la Conversation',
    'avatar.stopConversation': 'Arrêter la Conversation',
    
    // Buttons
    'button.subscribe': 'S\'abonner Maintenant',
    'button.viewPlans': 'Voir les Plans',
    'button.startTrial': 'Commencer l\'Essai Gratuit de 7 Jours',
    'button.close': 'Fermer',
    'button.cancel': 'Annuler',
    
    // Wellness Features
    'wellness.checkIn': 'Enregistrement Quotidien',
    'wellness.mood': 'Comment vous vous sentez aujourd\'hui?',
    'wellness.gratitude': 'Pratique de Gratitude',
    'wellness.goals': 'Objectifs de Bien-être',
  },
  
  de: {
    // Auth & Navigation
    'auth.welcome': 'Willkommen bei Resilios',
    'auth.subtitle': 'Dein KI-gestützter Begleiter für mentale Gesundheit',
    'auth.emailPlaceholder': 'Gib deine E-Mail ein',
    'auth.loginButton': 'Los geht\'s',
    'auth.logoutButton': 'Abmelden',
    
    // Pricing
    'pricing.title': 'Wählen Sie Ihren Plan',
    'pricing.free': 'Kostenlos',
    'pricing.freeTier': '100 Chats pro Tag',
    'pricing.premium': 'Premium',
    'pricing.premiumPrice': '4,99 $/Monat',
    'pricing.sevenDayTrial': '7 Tage kostenlos testen',
    'pricing.cardRequired': 'Karte erforderlich',
    'pricing.features': 'Premium-Funktionen',
    'pricing.unlimitedChats': 'Unbegrenzte Chats',
    'pricing.deeperThinking': 'Tiefere Antworten',
    'pricing.videoAnalysis': 'Videoanalyse',
    'pricing.fullWellnessPlan': 'Vollständiger Wellnessplan',
    'pricing.priorityFeatures': 'Früher Zugang zu neuen Funktionen',
    
    // Chat
    'chat.title': 'Chatten Sie mit Resilios',
    'chat.messageInputPlaceholder': 'Geben Sie Ihre Nachricht ein...',
    'chat.sendButton': 'Senden',
    'chat.quotaExceeded': 'Tägliches Chat-Limit erreicht (100 für kostenlose Benutzer)',
    'chat.upgradePrompt': 'Führen Sie ein Upgrade auf Premium durch, um unbegrenzte Chats zu erhalten',
    
    // Live Avatar
    'avatar.premium': 'Live-Avatar',
    'avatar.premiumOnly': 'Premium-Funktion',
    'avatar.subscribePrompt': 'Abonnieren Sie, um den Live-Avatar zu nutzen',
    'avatar.startConversation': 'Gespräch Starten',
    'avatar.stopConversation': 'Gespräch Beenden',
    
    // Buttons
    'button.subscribe': 'Jetzt Abonnieren',
    'button.viewPlans': 'Pläne Anzeigen',
    'button.startTrial': '7-Tage-Kostenlos-Test Starten',
    'button.close': 'Schließen',
    'button.cancel': 'Abbrechen',
    
    // Wellness Features
    'wellness.checkIn': 'Tägliche Einchecken',
    'wellness.mood': 'Wie fühlen Sie sich heute?',
    'wellness.gratitude': 'Dankbarkeitspraxis',
    'wellness.goals': 'Wellness-Ziele',
  },
  
  pt: {
    // Auth & Navigation
    'auth.welcome': 'Bem-vindo ao Resilios',
    'auth.subtitle': 'Seu companheiro de bem-estar mental alimentado por IA',
    'auth.emailPlaceholder': 'Digite seu e-mail',
    'auth.loginButton': 'Começar',
    'auth.logoutButton': 'Sair',
    
    // Pricing
    'pricing.title': 'Escolha Seu Plano',
    'pricing.free': 'Gratuito',
    'pricing.freeTier': '100 chats por dia',
    'pricing.premium': 'Premium',
    'pricing.premiumPrice': 'R$ 24,99/mês',
    'pricing.sevenDayTrial': 'Teste gratuito de 7 dias',
    'pricing.cardRequired': 'Cartão obrigatório',
    'pricing.features': 'Recursos Premium',
    'pricing.unlimitedChats': 'Chats ilimitados',
    'pricing.deeperThinking': 'Respostas mais profundas',
    'pricing.videoAnalysis': 'Análise de vídeo',
    'pricing.fullWellnessPlan': 'Plano de bem-estar completo',
    'pricing.priorityFeatures': 'Acesso antecipado a novos recursos',
    
    // Chat
    'chat.title': 'Converse com Resilios',
    'chat.messageInputPlaceholder': 'Digite sua mensagem...',
    'chat.sendButton': 'Enviar',
    'chat.quotaExceeded': 'Limite de chats diário atingido (100 para usuários gratuitos)',
    'chat.upgradePrompt': 'Atualize para Premium para chats ilimitados',
    
    // Live Avatar
    'avatar.premium': 'Avatar ao Vivo',
    'avatar.premiumOnly': 'Recurso premium',
    'avatar.subscribePrompt': 'Inscreva-se para usar o Avatar ao Vivo',
    'avatar.startConversation': 'Iniciar Conversa',
    'avatar.stopConversation': 'Parar Conversa',
    
    // Buttons
    'button.subscribe': 'Inscrever-se Agora',
    'button.viewPlans': 'Ver Planos',
    'button.startTrial': 'Iniciar Teste Gratuito de 7 Dias',
    'button.close': 'Fechar',
    'button.cancel': 'Cancelar',
    
    // Wellness Features
    'wellness.checkIn': 'Check-in Diário',
    'wellness.mood': 'Como você se sente hoje?',
    'wellness.gratitude': 'Prática de Gratidão',
    'wellness.goals': 'Objetivos de Bem-estar',
  },
  
  ja: {
    // Auth & Navigation
    'auth.welcome': 'Resili​osへようこそ',
    'auth.subtitle': 'あなたのAI駆動のメンタルウェルネスコンパニオン',
    'auth.emailPlaceholder': 'メールアドレスを入力してください',
    'auth.loginButton': '始める',
    'auth.logoutButton': 'ログアウト',
    
    // Pricing
    'pricing.title': 'プランを選択してください',
    'pricing.free': '無料',
    'pricing.freeTier': '1日100チャット',
    'pricing.premium': 'プレミアム',
    'pricing.premiumPrice': '$4.99/月',
    'pricing.sevenDayTrial': '7日間無料トライアル',
    'pricing.cardRequired': 'カード必須',
    'pricing.features': 'プレミアム機能',
    'pricing.unlimitedChats': '無制限チャット',
    'pricing.deeperThinking': 'より深い思考',
    'pricing.videoAnalysis': 'ビデオ分析',
    'pricing.fullWellnessPlan': '完全なウェルネスプラン',
    'pricing.priorityFeatures': '新機能への早期アクセス',
    
    // Chat
    'chat.title': 'Resili​osとチャット',
    'chat.messageInputPlaceholder': 'メッセージを入力してください...',
    'chat.sendButton': '送信',
    'chat.quotaExceeded': '毎日のチャット制限に達しました（無料ユーザーは100)',
    'chat.upgradePrompt': 'プレミアムにアップグレードして無制限チャットを利用できます',
    
    // Live Avatar
    'avatar.premium': 'ライブアバター',
    'avatar.premiumOnly': 'プレミアム機能',
    'avatar.subscribePrompt': 'ライブアバターを使用するには登録してください',
    'avatar.startConversation': '会話を開始',
    'avatar.stopConversation': '会話を終了',
    
    // Buttons
    'button.subscribe': '今すぐ登録',
    'button.viewPlans': 'プランを表示',
    'button.startTrial': '7日間無料トライアルを開始',
    'button.close': '閉じる',
    'button.cancel': 'キャンセル',
    
    // Wellness Features
    'wellness.checkIn': '毎日のチェックイン',
    'wellness.mood': '今日の気分はどうですか?',
    'wellness.gratitude': '感謝の実践',
    'wellness.goals': 'ウェルネスの目標',
  },
  
  zh: {
    // Auth & Navigation
    'auth.welcome': '欢迎来到 Resilios',
    'auth.subtitle': '您的AI驱动的心理健康伴侣',
    'auth.emailPlaceholder': '输入您的电子邮件',
    'auth.loginButton': '开始',
    'auth.logoutButton': '退出',
    
    // Pricing
    'pricing.title': '选择您的计划',
    'pricing.free': '免费',
    'pricing.freeTier': '每天100次聊天',
    'pricing.premium': '高级会员',
    'pricing.premiumPrice': '$4.99/月',
    'pricing.sevenDayTrial': '7天免费试用',
    'pricing.cardRequired': '需要卡',
    'pricing.features': '高级功能',
    'pricing.unlimitedChats': '无限制聊天',
    'pricing.deeperThinking': '更深入的思考',
    'pricing.videoAnalysis': '视频分析',
    'pricing.fullWellnessPlan': '完整的健康计划',
    'pricing.priorityFeatures': '提前获得新功能',
    
    // Chat
    'chat.title': '与 Resilios 聊天',
    'chat.messageInputPlaceholder': '输入您的消息...',
    'chat.sendButton': '发送',
    'chat.quotaExceeded': '已达到每日聊天限制（免费用户100次）',
    'chat.upgradePrompt': '升级到高级会员以获得无限制聊天',
    
    // Live Avatar
    'avatar.premium': '实时化身',
    'avatar.premiumOnly': '高级功能',
    'avatar.subscribePrompt': '订阅以使用实时化身',
    'avatar.startConversation': '开始对话',
    'avatar.stopConversation': '停止对话',
    
    // Buttons
    'button.subscribe': '立即订阅',
    'button.viewPlans': '查看计划',
    'button.startTrial': '开始7天免费试用',
    'button.close': '关闭',
    'button.cancel': '取消',
    
    // Wellness Features
    'wellness.checkIn': '每日签到',
    'wellness.mood': '你今天感觉如何?',
    'wellness.gratitude': '感恩实践',
    'wellness.goals': '健康目标',
  },
};

/**
 * Detect browser language and return supported language or default to 'en'
 */
export function detectLanguage(): Language {
  const query = new URLSearchParams(window.location.search);
  const langParam = query.get('lang') as Language | null;
  
  if (langParam && langParam in translations) {
    return langParam;
  }

  const browserLang = navigator.language.split('-')[0];
  if (browserLang in translations) {
    return browserLang as Language;
  }

  return 'en';
}

/**
 * Translate a key to the target language
 */
export function t(key: string, language: Language = 'en'): string {
  return translations[language]?.[key] || translations['en'][key] || key;
}

/**
 * Create a translation function for a specific language
 */
export function createTranslator(language: Language) {
  return (key: string) => t(key, language);
}
