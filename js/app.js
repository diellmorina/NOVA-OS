(() => {
  'use strict';

  const STORE_KEY = 'nova-os-state-v1';
  const APP_DEFS = [
    { id: 'files', name: 'Files', icon: '📁', width: 760, height: 520 },
    { id: 'notes', name: 'Notepad', icon: '📝', width: 700, height: 510 },
    { id: 'calculator', name: 'Calculator', icon: '🧮', width: 360, height: 510 },
    { id: 'browser', name: 'Browser', icon: '🌐', width: 820, height: 590 },
    { id: 'settings', name: 'Settings', icon: '⚙️', width: 760, height: 560 },
    { id: 'terminal', name: 'Terminal', icon: '🖥️', width: 690, height: 460 },
    { id: 'recycle', name: 'Recycle Bin', icon: '🗑️', width: 690, height: 460 },
    { id: 'performance', name: 'Performance', icon: '◒', width: 680, height: 450 },
    { id: 'profile', name: 'Your account', icon: '👤', width: 520, height: 440 }
  ];
  const DESKTOP_APPS = ['files', 'notes', 'calculator', 'browser', 'settings', 'terminal', 'recycle'];
  const PINNED_APPS = ['files', 'browser', 'notes', 'calculator', 'settings'];
  const DEFAULT_STATE = {
    settings: { theme: 'dark', wallpaper: 0, customWallpaper: '', accent: '#8ed8c4', taskbarPosition: 'bottom', iconSize: 'medium', desktopIconLayout: 'free', notifications: true, sounds: false, volume: 68, pin: '', language: 'en' },
    user: { username: 'Nova User', computerName: 'NOVA-DESKTOP', picture: '' },
    files: [
      { id: 'welcome', name: 'Welcome.txt', type: 'text', location: 'Desktop', content: 'Welcome to Nova OS.\n\nYour browser is now a little desktop of its own.\n\nTry the Start menu, open an app, or right-click in this folder.', modified: Date.now() },
      { id: 'project', name: 'Final project.txt', type: 'text', location: 'Documents', content: 'Operating System Simulator\n\nA small world running entirely in your browser.', modified: Date.now() },
      { id: 'todo', name: 'Weekend plans.txt', type: 'text', location: 'Documents', content: '1. Make something useful\n2. Take a proper break', modified: Date.now() },
      { id: 'downloads', name: 'Nova-setup.zip', type: 'archive', location: 'Downloads', content: 'A pretend archive. No installation required.', modified: Date.now() },
      { id: 'photo', name: 'Coastline.jpg', type: 'image', location: 'Pictures', content: 'A quiet afternoon by the water.', modified: Date.now() },
      { id: 'music', name: 'Soft Focus.mp3', type: 'audio', location: 'Music', content: '03:42 · Nova Radio', modified: Date.now() },
      { id: 'video', name: 'Studio tour.mp4', type: 'video', location: 'Videos', content: '01:18 · Local video sample', modified: Date.now() }
    ],
    recycle: [], drafts: {}, bookmarks: ['https://www.google.com', 'https://www.wikipedia.org', 'https://www.youtube.com'], notifications: [], recent: [], desktopPositions: {}, windowPositions: {}
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const SQ = {
    'Starting Nova OS': 'Po nis Nova OS',
    'Preparing your workspace': 'Po përgatitet hapësira juaj',
    'Welcome to Nova OS': 'Mirë se vini në Nova OS',
    'Let’s set up your computer.': 'Le ta konfigurojmë kompjuterin tuaj.',
    'Language': 'Gjuha',
    'Your name': 'Emri juaj',
    'Enter your name': 'Shkruani emrin tuaj',
    'Would you like a passcode?': 'Dëshironi një kodkalim?',
    'No passcode': 'Pa kodkalim',
    'Set a passcode': 'Vendosni një kodkalim',
    'Passcode (4–12 digits)': 'Kodkalimi (4–12 shifra)',
    'Your data is saved only in this browser. It is not synced or protected by a real account.': 'Të dhënat ruhen vetëm në këtë shfletues. Ato nuk sinkronizohen dhe nuk mbrohen nga një llogari reale.',
    'Finish setup': 'Përfundo konfigurimin',
    'English': 'Anglisht',
    'Shqip (Albanian)': 'Shqip',
    'Enter passcode': 'Shkruani kodkalimin',
    'Unlock': 'Shkyçu',
    'Continue': 'Vazhdo',
    'No passcode is set. You can continue.': 'Nuk është caktuar kodkalim. Mund të vazhdoni.',
    'Enter your passcode to continue': 'Shkruani kodkalimin për të vazhduar',
    'That passcode did not match. Try again.': 'Kodkalimi nuk përputhet. Provoni përsëri.',
    'Lock screen': 'Ekrani i kyçjes',
    'Connected': 'I lidhur',
    'Open Files': 'Hap Skedarët',
    'Open Notepad': 'Hap Bllokun e shënimeve',
    'Open Calculator': 'Hap Kalkulatorin',
    'Open Browser': 'Hap Shfletuesin',
    'Open Settings': 'Hap Cilësimet',
    'Open Terminal': 'Hap Terminalin',
    'Open Recycle Bin': 'Hap Koshin e riciklimit',
    'Open Performance': 'Hap Performancën',
    'Open Your account': 'Hap Llogarinë tuaj',
    'Files': 'Skedarët',
    'Notepad': 'Blloku i shënimeve',
    'Calculator': 'Kalkulatori',
    'Browser': 'Shfletuesi',
    'Settings': 'Cilësimet',
    'Terminal': 'Terminali',
    'Recycle Bin': 'Koshi i riciklimit',
    'Performance': 'Performanca',
    'Your account': 'Llogaria juaj',
    'Start menu': 'Menyja Start',
    'Search': 'Kërko',
    'Search anything': 'Kërko gjithçka',
    'Notifications': 'Njoftimet',
    'Open calendar': 'Hap kalendarin',
    'User profile': 'Profili i përdoruesit',
    'Places': 'Vendndodhjet',
    'Home': 'Kryefaqja',
    'Desktop': 'Desktopi',
    'Documents': 'Dokumentet',
    'Downloads': 'Shkarkimet',
    'Pictures': 'Fotografitë',
    'Music': 'Muzika',
    'Videos': 'Videot',
    '＋ Folder': '＋ Dosje',
    '＋ Text file': '＋ Skedar teksti',
    'Search this folder': 'Kërko në këtë dosje',
    'Name': 'Emri',
    'Date modified': 'Data e ndryshimit',
    'Type': 'Lloji',
    'This folder is empty.': 'Kjo dosje është bosh.',
    'New draft': 'Draft i ri',
    'New': 'I ri',
    'Open': 'Hap',
    'Save': 'Ruaj',
    'Save as': 'Ruaj si',
    'Rename': 'Riemërto',
    'Delete': 'Fshi',
    'Start with a blank page...': 'Filloni me një faqe bosh...',
    'Unsaved draft': 'Draft i paruajtur',
    'characters': 'karaktere',
    'words': 'fjalë',
    'New tab': 'Skedë e re',
    'Search Google or enter a web address': 'Kërkoni në Google ose shkruani një adresë uebi',
    'Back': 'Prapa',
    'Forward': 'Përpara',
    'Reload': 'Ringarko',
    'Home': 'Kryefaqja',
    'Bookmark': 'Faqerojtës',
    'If this website does not appear, it may block embedded browsers.': 'Nëse faqja nuk shfaqet, mund të bllokojë shfletuesit e integruar.',
    'Open in new tab ↗': 'Hap në skedë të re ↗',
    'Personalization': 'Personalizimi',
    'System': 'Sistemi',
    'Notifications': 'Njoftimet',
    'Privacy': 'Privatësia',
    'About': 'Rreth',
    'Make this workspace feel like yours.': 'Përshtateni këtë hapësirë sipas dëshirës.',
    'A quick view of this simulated device.': 'Një përmbledhje e kësaj pajisjeje të simuluar.',
    'Manage the data stored in this browser.': 'Menaxhoni të dhënat e ruajtura në këtë shfletues.',
    'A small desktop, made for the web.': 'Një desktop i vogël, i krijuar për uebin.',
    'Choose which alerts you receive.': 'Zgjidhni njoftimet që dëshironi të merrni.',
    'Appearance': 'Pamja',
    'Choose a comfortable workspace': 'Zgjidhni një hapësirë të rehatshme pune',
    'Color mode': 'Modaliteti i ngjyrave',
    'Dark': 'E errët',
    'Light': 'E çelët',
    'Accent color': 'Ngjyra theksuese',
    'Wallpaper': 'Sfondi',
    'Custom photo': 'Foto personale',
    'Choose photo': 'Zgjidh foto',
    'Remove photo': 'Hiq foton',
    'Choose an image file up to 15 MB.': 'Zgjidhni një imazh deri në 15 MB.',
    'Wallpaper photo saved': 'Fotoja e sfondit u ruajt',
    'Wallpaper photo removed': 'Fotoja e sfondit u hoq',
    'Wallpaper not changed': 'Sfondi nuk u ndryshua',
    'Unable to use this image. Choose a different photo.': 'Nuk mund të përdoret ky imazh. Zgjidhni një foto tjetër.',
    'The selected image is too large. Choose a file under 15 MB.': 'Imazhi i zgjedhur është shumë i madh. Zgjidhni një skedar nën 15 MB.',
    'Photo upload is unavailable in this browser.': 'Ngarkimi i fotos nuk është i disponueshëm në këtë shfletues.',
    'Wallpaper updated': 'Sfondi u përditësua',
    'Your desktop has a new view.': 'Desktopi juaj ka një pamje të re.',
    'Desktop': 'Desktopi',
    'Taskbar position': 'Pozicioni i shiritit të detyrave',
    'Bottom': 'Poshtë',
    'Top': 'Sipër',
    'Left': 'Majtas',
    'Desktop icon size': 'Madhësia e ikonave të desktopit',
    'Icon arrangement': 'Renditja e ikonave',
    'Free form': 'Të lira',
    'Align to grid': 'Rreshto në rrjetë',
    'Refresh': 'Rifresko',
    'New': 'I ri',
    'New folder': 'Dosje e re',
    'New text file': 'Skedar i ri teksti',
    'Personalize': 'Personalizo',
    'Small': 'E vogël',
    'Medium': 'Mesatare',
    'Large': 'E madhe',
    'Account security': 'Siguria e llogarisë',
    'Lock screen PIN': 'PIN-i i ekranit të kyçjes',
    'Change PIN': 'Ndrysho PIN-in',
    'Device specifications': 'Specifikimet e pajisjes',
    'Edition': 'Edicioni',
    'Version': 'Versioni',
    'Browser engine': 'Motori i shfletuesit',
    'Computer name': 'Emri i kompjuterit',
    'Computer': 'Kompjuteri',
    'Signed in as': 'I identifikuar si',
    'Memory': 'Memoria',
    'Storage': 'Hapësira ruajtëse',
    'Open performance dashboard': 'Hap panelin e performancës',
    'Notification preferences': 'Preferencat e njoftimeve',
    'Show notifications': 'Shfaq njoftimet',
    'Application alerts and system messages': 'Sinjalizimet e aplikacioneve dhe mesazhet e sistemit',
    'Notification sounds': 'Tingujt e njoftimeve',
    'Test sound': 'Provo tingullin',
    'Volume controls': 'Kontrollet e volumit',
    'Volume': 'Volumi',
    'Test sound played.': 'Tingulli i provës u luajt.',
    'Volume is muted.': 'Volumi është pa zë.',
    'Audio is unavailable in this browser.': 'Audio nuk është e disponueshme në këtë shfletues.',
    'Send a test message': 'Dërgo një mesazh prove',
    'Local data': 'Të dhënat lokale',
    'Your files and settings are stored in this browser on this device, separately for each local profile.': 'Skedarët dhe cilësimet ruhen në këtë shfletues dhe pajisje.',
    'Clear notification history': 'Pastro historikun e njoftimeve',
    'Clear': 'Pastro',
    'Reset settings': 'Rivendos cilësimet',
    'Restore appearance and notification defaults': 'Rikthe pamjen dhe njoftimet e parazgjedhura',
    'Reset Nova OS': 'Rivendos Nova OS',
    'Reset this profile': 'Rivendos këtë profil',
    'Delete this profile’s files, notes, and simulator settings': 'Fshi skedarët, shënimet dhe cilësimet e këtij profili',
    'Reset profile': 'Rivendos profilin',
    'Personalize the details shown around Nova OS.': 'Përshtatni të dhënat që shfaqen në Nova OS.',
    'This computer': 'Ky kompjuter',
    'Profile picture URL': 'Adresa e fotos së profilit',
    'Save changes': 'Ruaj ndryshimet',
    'Your name': 'Emri juaj',
    'Power': 'Energjia',
    'Lock': 'Kyç',
    'Restart Simulator': 'Rinis simulatorin',
    'Shut Down Simulator': 'Fik simulatorin',
    'Search apps and files': 'Kërko aplikacione dhe skedarë',
    'Pinned': 'Të fiksuara',
    'All apps': 'Të gjitha aplikacionet',
    'Recently opened': 'Hapur së fundmi',
    'Account': 'Llogaria',
    'Search everything': 'Kërko gjithçka',
    'Search apps, files, settings, and notes': 'Kërko aplikacione, skedarë, cilësime dhe shënime',
    'No matches yet.': 'Nuk ka rezultate.',
    'You’re all caught up.': 'Jeni në rregull.',
    'Clear all': 'Pastro të gjitha',
    'Calendar': 'Kalendari',
    'Empty recycle bin': 'Zbraz koshin e riciklimit',
    'Recycle Bin is empty.': 'Koshi i riciklimit është bosh.',
    'Cancel': 'Anulo',
    'Done': 'U krye',
    'Save document as': 'Ruaj dokumentin si',
    'Choose a name for your text file.': 'Zgjidhni një emër për skedarin e tekstit.',
    'Rename document': 'Riemërto dokumentin',
    'Choose a new name for your document.': 'Zgjidhni një emër të ri për dokumentin.',
    'Remove passcode?': 'Të hiqet kodkalimi?',
    'Passcode removed': 'Kodkalimi u hoq',
    'Change passcode': 'Ndrysho kodkalimin',
    'Choose a new passcode using 4 to 12 digits.': 'Zgjidhni një kodkalim të ri me 4 deri në 12 shifra.',
    'Use between 4 and 12 digits.': 'Përdorni nga 4 deri në 12 shifra.',
    'This passcode protects only this browser on this device.': 'Ky kodkalim mbron vetëm këtë shfletues në këtë pajisje.',
    'Close': 'Mbyll',
    'Minimize': 'Minimizo',
    'Maximize': 'Maksimizo',
    'Storage is full': 'Hapësira ruajtëse është plot',
    'Remove a few files and try again.': 'Hiqni disa skedarë dhe provoni përsëri.',
    'No matching files.': 'Nuk u gjetën skedarë përputhës.',
    'No documents found': 'Nuk u gjetën dokumente',
    'Create a new text file first.': 'Krijoni fillimisht një skedar të ri teksti.',
    'Invalid web address': 'Adresa e uebit nuk është e vlefshme',
    'Enter a valid web address or search term.': 'Shkruani një adresë të vlefshme uebi ose term kërkimi.',
    'Ready when you are.': 'Gati kur të jeni.',
    'opened': 'u hap',
    'Browser opened': 'Shfletuesi u hap',
    'Files opened': 'Skedarët u hapën',
    'Notepad opened': 'Blloku i shënimeve u hap',
    'Calculator opened': 'Kalkulatori u hap',
    'Settings opened': 'Cilësimet u hapën',
    'Terminal opened': 'Terminali u hap',
    'Recycle Bin opened': 'Koshi i riciklimit u hap',
    'Performance opened': 'Performanca u hap',
    'Your account opened': 'Llogaria juaj u hap',
    'Close tab': 'Mbyll skedën',
    'Open all apps': 'Hap të gjitha aplikacionet',
    'Open calendar': 'Hap kalendarin',
    'Battery 86 percent': 'Bateria 86 për qind',
    'Battery 86 percent': 'Bateria 86 për qind',
    'Battery 86%': 'Bateria 86%',
    'Wi-Fi connected': 'Wi-Fi i lidhur',
    'Volume': 'Volumi',
    'Search (Ctrl+K)': 'Kërko (Ctrl+K)',
    'Open search': 'Hap kërkimin',
    'Add tab': 'Shto skedë',
    'Nova tab': 'Skedë Nova',
    'Search files': 'Kërko skedarë',
    'Search local files': 'Kërko skedarët lokalë',
    'Search anything': 'Kërko gjithçka',
    'File manager': 'Menaxheri i skedarëve',
    'File Explorer': 'Eksploruesi i skedarëve',
    'Personalize': 'Personalizo',
    'School Portal': 'Portali i shkollës',
    'Search Engine': 'Motori i kërkimit',
    'Today, in brief': 'Sot, shkurtimisht',
    'Page not found': 'Faqja nuk u gjet',
    'A bright, breezy afternoon.': 'Një pasdite e ndritshme dhe me fllad.',
    'No documents found': 'Nuk u gjetën dokumente',
    'Nothing on the public web, but your local files are always close by.': 'Nuk u gjet asgjë në uebin publik, por skedarët tuaj lokalë janë pranë.',
    'Search local files': 'Kërko skedarët lokalë',
    'New Folder': 'Dosje e re',
    'New Text File': 'Skedar i ri teksti',
    'File': 'Skedari',
    'Choose a comfortable workspace': 'Zgjidhni një hapësirë të rehatshme pune',
    'Personalization': 'Personalizimi',
    'Privacy': 'Privatësia',
    'No passcode required': 'Nuk kërkohet kodkalim',
    'Search anything': 'Kërko gjithçka',
    'A browser desktop made with HTML, CSS & JavaScript. Everything stays on this device.': 'Një desktop shfletuesi i krijuar me HTML, CSS dhe JavaScript. Gjithçka ruhet në këtë pajisje.',
    'Your data and settings are stored in this browser on this device.': 'Të dhënat dhe cilësimet ruhen në këtë shfletues dhe pajisje.',
    'Search (Ctrl+K)': 'Kërko (Ctrl+K)',
    'About': 'Rreth',
    'The lock screen no longer requires a passcode.': 'Ekrani i kyçjes nuk kërkon më kodkalim.',
    'Your browser is now a little desktop of its own.': 'Shfletuesi juaj tani është një desktop i vogël më vete.',
    'Your files and settings are stored in this browser on this device.': 'Skedarët dhe cilësimet ruhen në këtë shfletues dhe pajisje.',
    'Profile picture URL': 'Adresa e fotos së profilit',
    'PIN': 'PIN-i',
    'Storage is full': 'Hapësira ruajtëse është plot',
    'Change lock screen passcode': 'Ndrysho kodkalimin e ekranit të kyçjes',
    'Remove passcode': 'Hiq kodkalimin',
    'Unlock without entering a PIN.': 'Shkyç pa shkruar PIN-in.',
    'The lock screen already has no passcode.': 'Ekrani i kyçjes nuk ka kodkalim.',
    'Passcode options': 'Opsionet e kodkalimit',
    'Choose a new 4 to 12 digit PIN.': 'Zgjidhni një PIN të ri me 4 deri në 12 shifra.',
    'Enter your passcode to continue': 'Shkruani kodkalimin për të vazhduar',
    'Your desktop is now ready.': 'Desktopi juaj është gati.',
    'Setting updated': 'Cilësimi u përditësua',
    'Color mode changed.': 'Modaliteti i ngjyrave u ndryshua.',
    'Accent color changed.': 'Ngjyra theksuese u ndryshua.',
    'Taskbar position changed.': 'Pozicioni i shiritit të detyrave u ndryshua.',
    'Icon size changed.': 'Madhësia e ikonave u ndryshua.',
    'Notification preference changed.': 'Preferenca e njoftimeve u ndryshua.',
    'Good morning.': 'Mirëmëngjes.',
    'Your week at a glance.': 'Java juaj me një shikim.',
    'Nothing to show.': 'Nuk ka asgjë për të shfaqur.',
    'An error occurred': 'Ndodhi një gabim.',
    'No preview available.': 'Pamja paraprake nuk është e disponueshme.',
    'New folder': 'Dosje e re',
    'New document.txt': 'Dokument i ri.txt',
    'Folder': 'Dosje',
    'Text file': 'Skedar teksti',
    'Archive': 'Arkiv',
    'Image': 'Imazh',
    'Audio': 'Audio',
    'Video': 'Video',
    'PDF': 'PDF',
    'Desktop icons': 'Ikonat e desktopit',
    'Shut down': 'Fik',
    'Lock': 'Kyç',
    'Restart': 'Rinis',
    'Minimize': 'Minimizo',
    'Maximize': 'Maksimizo',
    'Close': 'Mbyll',
    'Properties': 'Vetitë',
    'Move to…': 'Zhvendos te…',
    'Delete permanently': 'Fshi përgjithmonë',
    'Restore': 'Rikthe',
    'Save changes': 'Ruaj ndryshimet',
    'Taskbar': 'Shiriti i detyrave',
    'Desktop icons': 'Ikonat e desktopit',
    'Your account': 'Llogaria juaj',
    'System search': 'Kërkimi i sistemit',
    'Notification center': 'Qendra e njoftimeve',
    'All apps →': 'Të gjitha aplikacionet →',
    'All apps  →': 'Të gjitha aplikacionet →',
    'Search apps and files': 'Kërko aplikacione dhe skedarë',
    'This site must open in a regular browser tab.': 'Kjo faqe duhet të hapet në një skedë të zakonshme të shfletuesit.',
    'Just now': 'Tani',
    'Your recent apps will show up here.': 'Aplikacionet e përdorura së fundmi do të shfaqen këtu.',
    'System search': 'Kërkimi i sistemit',
    'Starting Nova OS': 'Po nis Nova OS',
    'Nova OS · 1.0': 'Nova OS · 1.0',
    'Welcome to Nova OS.': 'Mirë se vini në Nova OS.',
    'Your browser is now a little desktop of its own.': 'Shfletuesi juaj tani është një desktop i vogël më vete.',
    'Try the Start menu, open an app, or right-click in this folder.': 'Provoni menynë Start, hapni një aplikacion ose klikoni me të djathtën në këtë dosje.',
    'Operating System Simulator': 'Simulator i sistemit operativ',
    'A small world running entirely in your browser.': 'Një botë e vogël që funksionon tërësisht në shfletuesin tuaj.',
    'Enter your passcode to continue': 'Shkruani kodkalimin për të vazhduar',
    'Search apps and files': 'Kërko aplikacione dhe skedarë',
    'This computer': 'Ky kompjuter',
    'Save profile': 'Ruaj profilin',
    'Save document as': 'Ruaj dokumentin si',
    'Choose a name for your text file.': 'Zgjidhni një emër për skedarin e tekstit.',
    'Rename item': 'Riemërto elementin',
    'Choose a new name for this item.': 'Zgjidhni një emër të ri për këtë element.',
    'Move item': 'Zhvendos elementin',
    'Enter Desktop, Documents, Downloads, Pictures, Music, or Videos.': 'Shkruani Desktopi, Dokumentet, Shkarkimet, Fotografitë, Muzika ose Videot.',
    'Choose a known folder': 'Zgjidhni një dosje të njohur',
    'Try Documents, Downloads, Pictures, Music, Videos, or Desktop.': 'Provoni Dokumentet, Shkarkimet, Fotografitë, Muzika, Videot ose Desktopi.',
    'Folder created': 'Dosja u krijua',
    'File created': 'Skedari u krijua',
    'Moved to Recycle Bin': 'U zhvendos në Koshin e riciklimit',
    'File renamed': 'Skedari u riemërtua',
    'File moved': 'Skedari u zhvendos',
    'File restored': 'Skedari u rikthye',
    'Recycle Bin emptied': 'Koshi i riciklimit u zbraz',
    'Deleted files have been removed.': 'Skedarët e fshirë u hoqën.',
    'Document saved': 'Dokumenti u ruajt',
    'Document renamed': 'Dokumenti u riemërtua',
    'Document deleted': 'Dokumenti u fshi',
    'Profile updated': 'Profili u përditësua',
    'Welcome': 'Mirë se vini',
    'Passcode updated': 'Kodkalimi u përditësua',
    'Your next unlock will use the new passcode.': 'Shkyçja e ardhshme do të përdorë kodkalimin e ri.',
    'Passcode not changed': 'Kodkalimi nuk u ndryshua',
    'Reset Nova OS?': 'Të rivendoset Nova OS?',
    'This permanently clears local files, notes, bookmarks, notifications, and settings. This cannot be undone.': 'Kjo fshin përgjithmonë skedarët, shënimet, faqerojtësit, njoftimet dhe cilësimet lokale. Ky veprim nuk mund të zhbëhet.',
    'Reset OS': 'Rivendos sistemin',
    'Reset settings': 'Rivendos cilësimet',
    'Appearance and alerts are back to default.': 'Pamja dhe sinjalizimet u rikthyen në parazgjedhje.',
    'Setting updated': 'Cilësimi u përditësua',
    'Your desktop has a new view.': 'Desktopi juaj ka një pamje të re.',
    'Settings reset': 'Cilësimet u rivendosën',
    'Refresh': 'Rifresko',
    'Properties': 'Vetitë',
    'Move to…': 'Zhvendos te…',
    'New Folder': 'Dosje e re',
    'New Text File': 'Skedar i ri teksti',
    'Empty recycle bin': 'Zbraz koshin e riciklimit',
    'Empty Recycle Bin?': 'Të zbrazet Koshi i riciklimit?',
    'These deleted items will be permanently removed.': 'Këto elemente të fshira do të hiqen përgjithmonë.',
    'Empty': 'Zbraz',
    'New folder': 'Dosje e re',
    'New document.txt': 'Dokument i ri.txt',
    'Desktop': 'Desktopi',
    'Documents': 'Dokumentet',
    'Downloads': 'Shkarkimet',
    'Pictures': 'Fotografitë',
    'Music': 'Muzika',
    'Videos': 'Videot',
    'Desktop file': 'Skedar desktopi',
    'Open document': 'Hap dokumentin',
    'A note from Mina': 'Një shënim nga Mina',
    'A tiny salute to the classics.': 'Një përshëndetje e vogël për klasikët.',
    'Secret mode unlocked': 'Modaliteti sekret u aktivizua',
    'Search or enter an address': 'Kërko ose shkruaj një adresë',
    'Your recent apps will show up here.': 'Aplikacionet e përdorura së fundmi do të shfaqen këtu.',
    'A browser desktop made with HTML, CSS & JavaScript. Everything stays on this device.': 'Një desktop shfletuesi i krijuar me HTML, CSS dhe JavaScript. Gjithçka ruhet në këtë pajisje.',
    'Nova OS Simulator': 'Simulatori Nova OS',
    'Everything stays on this device.': 'Gjithçka ruhet në këtë pajisje.',
    'Theme': 'Tema',
    'Network': 'Rrjeti',
    'Battery': 'Bateria',
    'Volume': 'Volumi',
    'Wi-Fi connected': 'Wi-Fi i lidhur',
    'About Nova OS': 'Rreth Nova OS',
    'Download': 'Shkarko',
    'Open file': 'Hap skedarin',
    'Modified': 'Ndryshuar',
    'characters': 'karaktere',
    'words': 'fjalë',
    'item': 'element',
    'items': 'elemente',
    'characters ·': 'karaktere ·',
    'words ·': 'fjalë ·',
    'Sort files': 'Rendit skedarët',
    'Folder name': 'Emri i dosjes',
    'Text file name': 'Emri i skedarit të tekstit',
    'Name your new folder.': 'Jepni një emër për dosjen e re.',
    'Name your new text file.': 'Jepni një emër për skedarin e ri të tekstit.',
    'Wallpaper 1': 'Sfondi 1',
    'Wallpaper 2': 'Sfondi 2',
    'Wallpaper 3': 'Sfondi 3',
    'Wallpaper 4': 'Sfondi 4',
    'Battery 86 percent': 'Bateria 86 për qind',
    'Search apps, files, settings, and notes': 'Kërko aplikacione, skedarë, cilësime dhe shënime',
    'Network': 'Rrjeti',
    'CPU': 'CPU',
    'Browser engine': 'Motori i shfletuesit',
    'Version 1.0.0 · Stable': 'Versioni 1.0.0 · I qëndrueshëm',
    'Computer': 'Kompjuteri',
    'Signed in as': 'I identifikuar si',
    'Connected to Nova network.': 'I lidhur me rrjetin Nova.',
    '86% · Power source: simulated.': '86% · Burimi i energjisë: i simuluar.',
    'No matching files.': 'Nuk u gjetën skedarë përputhës.',
    'Choose a file name.': 'Zgjidhni një emër për skedarin.',
    'Create a folder': 'Krijo dosje',
    'Create a text file': 'Krijo skedar teksti',
    'Please enter a name.': 'Ju lutemi shkruani një emër.',
    'Application alerts and system messages': 'Sinjalizimet e aplikacioneve dhe mesazhet e sistemit',
    'Your files and settings are stored in this browser on this device.': 'Skedarët dhe cilësimet ruhen në këtë shfletues dhe pajisje.',
    'This site must open in a regular browser tab.': 'Kjo faqe duhet të hapet në një skedë të zakonshme të shfletuesit.',
    'Just now': 'Tani'
  };
  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  let activeLanguage = 'en';
  function translateTextNode(node) {
    const current = node.nodeValue;
    const previous = textSources.get(node);
    const source = previous && current === previous.output ? previous.source : current;
    const trimmed = source.trim();
    const prefix = trimmed.match(/^[^\p{L}\p{N}]*/u)?.[0] || '';
    const key = trimmed.slice(prefix.length).replace(/\u00a0/g, ' ').trim();
    const wholeTranslation = activeLanguage === 'sq' ? SQ[trimmed] : null;
    let translation = wholeTranslation || (activeLanguage === 'sq' && prefix ? SQ[key] : null);
    if (!wholeTranslation && translation && prefix) translation = `${prefix}${translation}`;
    if (activeLanguage === 'sq' && !translation) {
      let match = trimmed.match(/^(\d+) items? · (.+)$/);
      if (match) translation = `${match[1]} ${match[1] === '1' ? 'element' : 'elemente'} · ${SQ[match[2]] || match[2]}`;
      match = trimmed.match(/^(\d+(?:\.\d+)?) KB used locally$/);
      if (!translation && match) translation = `${match[1]} KB të përdorura lokalisht`;
      match = trimmed.match(/^(\d+) characters · (\d+) words$/);
      if (!translation && match) translation = `${match[1]} karaktere · ${match[2]} fjalë`;
      match = trimmed.match(/^(\d+)m ago$/);
      if (!translation && match) translation = `${match[1]} min më parë`;
      match = trimmed.match(/^(\d+)h ago$/);
      if (!translation && match) translation = `${match[1]} orë më parë`;
      match = trimmed.match(/^(.+) opens outside Nova OS\.$/);
      if (!translation && match) translation = `${match[1]} duhet të hapet në një skedë të zakonshme të shfletuesit.`;
    }
    const output = translation ? `${source.slice(0, source.indexOf(trimmed))}${translation}${source.slice(source.indexOf(trimmed) + trimmed.length)}` : source;
    textSources.set(node, { source, output });
    if (current !== output) node.nodeValue = output;
  }
  function translateElement(root = document.body, language = state.settings.language) {
    activeLanguage = language === 'sq' ? 'sq' : 'en';
    document.documentElement.lang = activeLanguage === 'sq' ? 'sq-AL' : 'en';
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) translateTextNode(walker.currentNode);
    const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll('[title],[placeholder],[aria-label]')] : [];
    elements.filter(element => element.matches('[title],[placeholder],[aria-label]')).forEach(element => {
      ['title', 'placeholder', 'aria-label'].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        let sources = attributeSources.get(element);
        if (!sources) { sources = new Map(); attributeSources.set(element, sources); }
        const current = element.getAttribute(attribute);
        const previous = sources.get(attribute);
        const source = previous && current === previous.output ? previous.source : current;
        const output = activeLanguage === 'sq' ? (SQ[source] || source) : source;
        sources.set(attribute, { source, output });
        if (current !== output) element.setAttribute(attribute, output);
      });
    });
  }
  const locale = () => state.settings.language === 'sq' ? 'sq-AL' : 'en-US';
  const SQ_MONTHS = ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor'];
  const SQ_WEEKDAYS = ['e diel', 'e hënë', 'e martë', 'e mërkurë', 'e enjte', 'e premte', 'e shtunë'];
  function formatDate(date, options = {}) {
    if (state.settings.language !== 'sq') return date.toLocaleDateString(locale(), options);
    if (options.month === 'numeric' && options.day && options.year) {
      const year = options.year === '2-digit' ? String(date.getFullYear()).slice(-2) : date.getFullYear();
      return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${year}`;
    }
    const day = options.day ? String(date.getDate()) : '';
    const month = options.month ? SQ_MONTHS[date.getMonth()] : '';
    const year = options.year ? String(date.getFullYear()) : '';
    const dateParts = [day, month, year].filter(Boolean).join(' ');
    return options.weekday ? `${SQ_WEEKDAYS[date.getDay()]}, ${dateParts}` : dateParts;
  }
  function formatTime(date, options = {}) {
    if (state.settings.language !== 'sq') return date.toLocaleTimeString(locale(), options);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  const normalizeState = saved => {
    if (!saved || typeof saved !== 'object') return clone(DEFAULT_STATE);
    const savedVolume = Number(saved.settings?.volume);
    const savedCustomWallpaper = typeof saved.settings?.customWallpaper === 'string' && /^data:image\/jpeg;base64,/i.test(saved.settings.customWallpaper) ? saved.settings.customWallpaper : '';
    return {
        ...clone(DEFAULT_STATE), ...saved,
        settings: { ...clone(DEFAULT_STATE.settings), ...(saved.settings || {}), wallpaper: saved.settings?.wallpaper === 'custom' ? (savedCustomWallpaper ? 'custom' : DEFAULT_STATE.settings.wallpaper) : saved.settings?.wallpaper ?? DEFAULT_STATE.settings.wallpaper, customWallpaper: savedCustomWallpaper, desktopIconLayout: saved.settings?.desktopIconLayout === 'grid' ? 'grid' : 'free', volume: Number.isFinite(savedVolume) ? Math.max(0, Math.min(100, savedVolume)) : DEFAULT_STATE.settings.volume },
        user: { ...clone(DEFAULT_STATE.user), ...(saved.user || {}) },
        files: Array.isArray(saved.files) ? saved.files : clone(DEFAULT_STATE.files),
        recycle: Array.isArray(saved.recycle) ? saved.recycle : [], drafts: saved.drafts || {},
        notifications: Array.isArray(saved.notifications) ? saved.notifications : [],
        bookmarks: Array.isArray(saved.bookmarks) ? saved.bookmarks.filter(site => /^https?:\/\//i.test(site)).length ? saved.bookmarks.filter(site => /^https?:\/\//i.test(site)) : clone(DEFAULT_STATE.bookmarks) : clone(DEFAULT_STATE.bookmarks),
        recent: Array.isArray(saved.recent) ? saved.recent : [], desktopPositions: saved.desktopPositions || {}, windowPositions: saved.windowPositions || {}
      };
  };
  let needsSetup = false;
  const loadState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (saved?.version === 2 && Array.isArray(saved.profiles)) {
        const active = saved.profiles.find(profile => profile?.id === saved.activeProfileId) || saved.profiles[0];
        const migrated = normalizeState(active?.state);
        if (migrated.settings.pin === '1234') migrated.settings.pin = '';
        needsSetup = true;
        return migrated;
      }
      if (saved?.version === 3 && saved.state && typeof saved.setupComplete === 'boolean') {
        needsSetup = !saved.setupComplete;
        return normalizeState(saved.state);
      }
      if (saved && typeof saved === 'object') {
        const migrated = normalizeState(saved);
        if (migrated.settings.pin === '1234') migrated.settings.pin = '';
        needsSetup = true;
        return migrated;
      }
    } catch {
      needsSetup = true;
    }
    needsSetup = true;
    return clone(DEFAULT_STATE);
  };
  let state = loadState();
  let zIndex = 20;
  let selectedFileId = null;
  let activeNoteId = null;
  let newNoteDraft = false;
  let currentFolder = 'Desktop';
  let fileSort = 'name';
  let fileQuery = '';
  let calcExpression = '';
  let calendarOffset = 0;
  let terminalHistory = [];
  let terminalHistoryIndex = -1;
  let matrixFrame = 0;
  let matrixAnimation = null;
  let performanceTimer = null;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const appDef = id => APP_DEFS.find(app => app.id === id) || APP_DEFS[0];
  const iconForFile = file => ({ folder: '📁', text: '📝', image: '🖼️', audio: '🎵', video: '🎬', archive: '📦', pdf: '📄' }[file.type] || '📄');
  const persist = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ version: 3, setupComplete: !needsSetup, state })); return true; }
    catch { toast('Storage is full', 'Remove a few files and try again.'); return false; }
  };
  const getAppWindow = id => $(`.window[data-app="${id}"]`);
  const windows = () => $$('.window', $('#windowLayer'));
  const notify = (title, message, icon = '◉') => {
    if (!state.settings.notifications) return;
    const item = { id: `${Date.now()}-${Math.random()}`, title, message, icon, time: Date.now() };
    state.notifications.unshift(item);
    state.notifications = state.notifications.slice(0, 40);
    persist(); renderNotificationDot();
    toast(title, message, icon);
    if (state.settings.sounds) playSound();
  };
  function playSound() {
    if (!state.settings.volume) return;
    try {
      if (!window.AudioContext) throw new Error('Web Audio API is unavailable.');
      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = 680;
      gain.gain.value = 0.035 * state.settings.volume / 100;
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + 0.07);
      oscillator.onended = () => audio.close();
      return true;
    } catch (error) {
      console.error('Unable to play Nova OS sound.', error);
      const status = $('#volumeStatus');
      if (status) status.textContent = 'Audio is unavailable in this browser.';
      return false;
    }
  }
  function updateVolumeControl() {
    const volume = Math.max(0, Math.min(100, Number(state.settings.volume) || 0));
    state.settings.volume = volume;
    const muted = volume === 0;
    const icon = muted ? '◯' : '◖';
    $('#volumeTrayIcon').textContent = icon;
    $('#volumePanelIcon').textContent = icon;
    const label = state.settings.language === 'sq' ? 'Volumi' : 'Volume';
    $('#trayVolume').setAttribute('aria-label', `${label}: ${volume}%`);
    $('#trayVolume').title = `${label}: ${volume}%`;
    $('#volumeSlider').value = String(volume);
    $('#volumeSlider').setAttribute('aria-valuetext', `${volume}%`);
    $('#volumeValue').textContent = `${volume}%`;
  }
  function toast(title, message, icon = '◉') {
    const stack = $('#toastStack');
    const node = document.createElement('div');
    node.className = 'toast';
    node.innerHTML = `<strong><span aria-hidden="true">${escapeHTML(icon)}</span> ${escapeHTML(title)}</strong><p>${escapeHTML(message)}</p>`;
    stack.append(node);
    setTimeout(() => node.remove(), 3900);
  }
  const setAvatar = (node, size = 'avatar') => {
    node.className = size;
    node.innerHTML = state.user.picture ? `<img alt="" src="${escapeHTML(state.user.picture)}">` : escapeHTML((state.user.username.trim()[0] || 'N').toUpperCase());
  };
  function applySettings() {
    const shell = $('#desktopShell');
    shell.classList.toggle('light-mode', state.settings.theme === 'light');
    shell.classList.remove('icon-small', 'icon-large');
    if (state.settings.iconSize === 'small') shell.classList.add('icon-small');
    if (state.settings.iconSize === 'large') shell.classList.add('icon-large');
    document.documentElement.style.setProperty('--accent', state.settings.accent || '#8ed8c4');
    const desktop = $('#desktop');
    desktop.dataset.wallpaper = String(state.settings.wallpaper === 'custom' ? 0 : state.settings.wallpaper || 0);
    if (state.settings.wallpaper === 'custom' && state.settings.customWallpaper) {
      desktop.style.backgroundImage = `linear-gradient(rgba(10, 16, 26, 0.12), rgba(10, 16, 26, 0.12)), url("${state.settings.customWallpaper}")`;
      desktop.style.backgroundSize = 'cover';
      desktop.style.backgroundPosition = 'center';
      desktop.style.backgroundRepeat = 'no-repeat';
    } else {
      desktop.style.backgroundImage = '';
      desktop.style.backgroundSize = '';
      desktop.style.backgroundPosition = '';
      desktop.style.backgroundRepeat = '';
    }
    const taskbar = $('#taskbar'); taskbar.classList.remove('position-top', 'position-left');
    shell.classList.remove('taskbar-top', 'taskbar-left');
    if (state.settings.taskbarPosition !== 'bottom') taskbar.classList.add(`position-${state.settings.taskbarPosition}`);
    if (state.settings.taskbarPosition === 'top') shell.classList.add('taskbar-top');
    if (state.settings.taskbarPosition === 'left') shell.classList.add('taskbar-left');
    updateVolumeControl();
    renderDesktopIcons(); renderTaskbar(); renderProfileBits(); updateLockScreen(); translateElement();
  }
  async function makeWallpaperDataUrl(file) {
    if (!/^image\/(jpeg|png|webp|gif|bmp|avif|tiff?)$/i.test(file.type)) throw new Error('Choose a supported image file.');
    if (file.size > 15 * 1024 * 1024) throw new Error('The selected image is too large.');
    const image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Unable to read the selected image.'));
      reader.onload = () => {
        const loaded = new Image();
        loaded.onload = () => resolve(loaded);
        loaded.onerror = () => reject(new Error('The selected file is not a readable image.'));
        loaded.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
    let scale = Math.min(1, 1600 / image.width, 1000 / image.height);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Photo processing is unavailable in this browser.');
    let dataUrl = '';
    for (let attempt = 0; attempt < 7; attempt++) {
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      dataUrl = canvas.toDataURL('image/jpeg', Math.max(0.5, 0.82 - attempt * 0.08));
      if ((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75 <= 850 * 1024) return dataUrl;
      scale *= 0.82;
    }
    if ((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75 > 1024 * 1024) throw new Error('This photo cannot be reduced enough to save.');
    return dataUrl;
  }
  async function setCustomWallpaper(file) {
    try {
      const dataUrl = await makeWallpaperDataUrl(file);
      const previous = { wallpaper: state.settings.wallpaper, customWallpaper: state.settings.customWallpaper };
      state.settings.customWallpaper = dataUrl;
      state.settings.wallpaper = 'custom';
      if (!persist()) {
        state.settings.wallpaper = previous.wallpaper;
        state.settings.customWallpaper = previous.customWallpaper;
        applySettings();
        rerenderApp('settings');
        return;
      }
      applySettings();
      rerenderApp('settings');
      notify('Wallpaper updated', 'Wallpaper photo saved.', '◐');
    } catch (error) {
      console.error('Unable to set the custom wallpaper.', error);
      const message = error.message === 'The selected image is too large.'
        ? 'The selected image is too large. Choose a file under 15 MB.'
        : error.message === 'Photo processing is unavailable in this browser.'
          ? 'Photo upload is unavailable in this browser.'
          : 'Unable to use this image. Choose a different photo.';
      toast('Wallpaper not changed', message, '⚠');
    }
  }
  function renderProfileBits() {
    $('#lockUsername').textContent = state.user.username;
    setAvatar($('#lockAvatar'));
    setAvatar($('#trayAvatar'), 'avatar avatar-small');
    const username = $('#startMenu .start-top strong'); if (username) username.textContent = state.user.username;
  }
  function renderDesktopIcons() {
    const holder = $('#desktopIcons');
    holder.innerHTML = DESKTOP_APPS.map((id, index) => {
      const app = appDef(id); const pos = state.desktopPositions[id] || { x: 12, y: 12 + index * 98 };
      return `<button class="desktop-icon" data-app="${id}" style="left:${pos.x}px;top:${pos.y}px" aria-label="Open ${escapeHTML(app.name)}"><span class="app-glyph">${app.icon}</span><span>${escapeHTML(app.name)}</span></button>`;
    }).join('');
    $$('.desktop-icon', holder).forEach(icon => {
      icon.addEventListener('pointerdown', startIconDrag);
      icon.addEventListener('dblclick', event => { event.preventDefault(); openApp(icon.dataset.app); });
      icon.addEventListener('click', () => { icon.dataset.moved = '0'; });
    });
  }
  function snapDesktopPosition(x, y, icon) {
    const desktop = $('#desktop');
    const maxX = Math.max(0, desktop.clientWidth - icon.offsetWidth);
    const maxY = Math.max(0, desktop.clientHeight - icon.offsetHeight);
    const snap = (value, origin, step, max) => Math.min(max, Math.max(0, origin + Math.round((value - origin) / step) * step));
    return { x: snap(x, 12, 104, maxX), y: snap(y, 12, 98, maxY) };
  }
  function arrangeDesktopIconsInGrid() {
    const desktop = $('#desktop');
    const rows = Math.max(1, Math.floor((desktop.clientHeight - 24) / 98) + 1);
    DESKTOP_APPS.forEach((id, index) => {
      const icon = $(`.desktop-icon[data-app="${id}"]`, $('#desktopIcons'));
      if (!icon) return;
      const position = snapDesktopPosition(12 + Math.floor(index / rows) * 104, 12 + (index % rows) * 98, icon);
      state.desktopPositions[id] = position;
      icon.style.left = `${position.x}px`;
      icon.style.top = `${position.y}px`;
    });
    persist();
  }
  function startIconDrag(event) {
    if (event.button !== 0) return;
    const icon = event.currentTarget; const rect = icon.getBoundingClientRect();
    const originX = event.clientX; const originY = event.clientY; let moved = false;
    icon.setPointerCapture(event.pointerId);
    const move = moveEvent => {
      const dx = moveEvent.clientX - originX; const dy = moveEvent.clientY - originY;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      const x = Math.max(0, Math.min($('#desktop').clientWidth - icon.offsetWidth, rect.left - $('#desktop').getBoundingClientRect().left + dx));
      const y = Math.max(0, Math.min($('#desktop').clientHeight - icon.offsetHeight, rect.top - $('#desktop').getBoundingClientRect().top + dy));
      if (moved) { icon.style.left = `${x}px`; icon.style.top = `${y}px`; }
    };
    const end = () => {
      icon.removeEventListener('pointermove', move); icon.removeEventListener('pointerup', end);
      if (moved) {
        icon.dataset.moved = '1';
        const position = state.settings.desktopIconLayout === 'grid'
          ? snapDesktopPosition(parseFloat(icon.style.left), parseFloat(icon.style.top), icon)
          : { x: parseFloat(icon.style.left), y: parseFloat(icon.style.top) };
        icon.style.left = `${position.x}px`;
        icon.style.top = `${position.y}px`;
        state.desktopPositions[icon.dataset.app] = position;
        persist(); setTimeout(() => { icon.dataset.moved = '0'; }, 80);
      }
    };
    icon.addEventListener('pointermove', move); icon.addEventListener('pointerup', end, { once: true });
  }
  function renderTaskbar() {
    $('#pinnedApps').innerHTML = PINNED_APPS.map(id => `<button class="taskbar-app" data-launch="${id}" title="${escapeHTML(appDef(id).name)}" aria-label="Open ${escapeHTML(appDef(id).name)}">${appDef(id).icon}</button>`).join('');
    $('#runningApps').innerHTML = windows().map(win => {
      const id = win.dataset.app; const app = appDef(id);
      return `<button class="taskbar-app running ${win.classList.contains('minimized') ? '' : (win.classList.contains('active-window') ? 'focused' : '')}" data-window="${id}" title="${escapeHTML(app.name)}">${app.icon}</button>`;
    }).join('');
    translateElement();
  }
  function appContent(id) {
    if (id === 'files') return fileManagerMarkup();
    if (id === 'notes') return notesMarkup();
    if (id === 'calculator') return calculatorMarkup();
    if (id === 'browser') return browserMarkup();
    if (id === 'terminal') return terminalMarkup();
    if (id === 'settings') return settingsMarkup('Personalization');
    if (id === 'recycle') return recycleMarkup();
    if (id === 'performance') return performanceMarkup();
    if (id === 'profile') return profileMarkup();
    return '<p class="empty-state">Nothing to show.</p>';
  }
  function openApp(id) {
    const app = appDef(id); let win = getAppWindow(id);
    if (win) { win.classList.remove('minimized'); focusWindow(win); }
    else {
      const saved = state.windowPositions[id];
      win = document.createElement('section'); win.className = 'window'; win.dataset.app = id; win.style.zIndex = ++zIndex;
      const defaultLeft = Math.max(10, (window.innerWidth - app.width) / 2 + (windows().length % 4) * 22);
      const defaultTop = Math.max(10, (window.innerHeight - app.height) / 2 - 24 + (windows().length % 4) * 18);
      win.style.left = `${saved?.x ?? defaultLeft}px`; win.style.top = `${saved?.y ?? defaultTop}px`;
      win.style.width = `${saved?.width ?? app.width}px`; win.style.height = `${saved?.height ?? app.height}px`;
      win.innerHTML = `<header class="window-titlebar"><div class="window-title"><span class="app-glyph">${app.icon}</span><span>${escapeHTML(app.name)}</span></div><div class="window-controls"><button class="window-control" data-window-action="minimize" aria-label="Minimize">−</button><button class="window-control" data-window-action="maximize" aria-label="Maximize">□</button><button class="window-control close" data-window-action="close" aria-label="Close">×</button></div></header><div class="window-body">${appContent(id)}</div>`;
      $('#windowLayer').append(win); bindWindowDrag(win); focusWindow(win);
      if (id === 'browser') bindBrowser(win);
      if (id === 'performance') startPerformance(win);
      if (id === 'terminal') setTimeout(() => $('.terminal-form input', win)?.focus(), 30);
    }
    state.recent = [id, ...state.recent.filter(item => item !== id)].slice(0, 6); persist(); renderTaskbar(); closePanels();
    if (!win.dataset.opened) { notify(`${app.name} opened`, 'Ready when you are.', app.icon); win.dataset.opened = '1'; }
    if (id === 'terminal') setTimeout(() => $('.terminal-form input', win)?.focus(), 30);
    return win;
  }
  function focusWindow(win) {
    windows().forEach(item => item.classList.remove('active-window'));
    win.classList.remove('minimized'); win.classList.add('active-window'); win.style.zIndex = ++zIndex; renderTaskbar();
  }
  function bindWindowDrag(win) {
    const bar = $('.window-titlebar', win); let drag = null;
    bar.addEventListener('pointerdown', event => {
      if (event.target.closest('.window-controls') || win.classList.contains('maximized')) return;
      focusWindow(win); drag = { x: event.clientX, y: event.clientY, left: win.offsetLeft, top: win.offsetTop };
      bar.setPointerCapture(event.pointerId);
    });
    bar.addEventListener('pointermove', event => {
      if (!drag) return;
      const maxX = Math.max(0, $('#desktop').clientWidth - 120); const maxY = Math.max(0, $('#desktop').clientHeight - 44);
      win.style.left = `${Math.min(maxX, Math.max(-win.offsetWidth + 120, drag.left + event.clientX - drag.x))}px`;
      win.style.top = `${Math.min(maxY, Math.max(0, drag.top + event.clientY - drag.y))}px`;
    });
    bar.addEventListener('pointerup', () => { if (drag) persistWindowPosition(win); drag = null; });
    win.addEventListener('pointerdown', () => focusWindow(win));
    win.addEventListener('dblclick', event => { if (event.target.closest('.window-titlebar') && !event.target.closest('.window-controls')) toggleMaximize(win); });
    win.addEventListener('pointerup', () => { if (!win.classList.contains('maximized')) persistWindowPosition(win); });
  }
  function persistWindowPosition(win) {
    state.windowPositions[win.dataset.app] = { x: win.offsetLeft, y: win.offsetTop, width: win.offsetWidth, height: win.offsetHeight }; persist();
  }
  function toggleMaximize(win) {
    if (win.classList.contains('maximized')) {
      win.classList.remove('maximized'); const saved = win.dataset.restore;
      if (saved) { const rect = JSON.parse(saved); win.style.left = rect.left; win.style.top = rect.top; win.style.width = rect.width; win.style.height = rect.height; }
    } else {
      win.dataset.restore = JSON.stringify({ left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height }); win.classList.add('maximized');
    }
    focusWindow(win);
  }
  function closeWindow(win) {
    if (win.dataset.app === 'performance') clearInterval(performanceTimer);
    if (win.dataset.app === 'notes') saveDraft();
    win.remove(); renderTaskbar();
    const remaining = windows().filter(item => !item.classList.contains('minimized'));
    if (remaining.length) focusWindow(remaining.at(-1));
  }
  function fileManagerMarkup() {
    const places = ['Home', 'Desktop', 'Documents', 'Downloads', 'Pictures', 'Music', 'Videos'];
    const files = visibleFiles();
    return `<div class="app-layout"><aside class="app-sidebar"><div class="side-heading">Places</div>${places.map(place => `<button class="side-item ${currentFolder === place ? 'selected' : ''}" data-folder="${escapeHTML(place)}">${({ Home: '⌂', Desktop: '▦', Documents: '▤', Downloads: '↓', Pictures: '▧', Music: '♫', Videos: '▷' })[place]} &nbsp;${place}</button>`).join('')}</aside><section class="file-main"><div class="app-toolbar"><button data-action="new-folder">＋ Folder</button><button data-action="new-file">＋ Text file</button><input class="file-search" placeholder="Search this folder" value="${escapeHTML(fileQuery)}" aria-label="Search files"><select class="file-sort" aria-label="Sort files"><option value="name" ${fileSort === 'name' ? 'selected' : ''}>Name</option><option value="modified" ${fileSort === 'modified' ? 'selected' : ''}>Date modified</option><option value="type" ${fileSort === 'type' ? 'selected' : ''}>Type</option></select><button title="Refresh" data-action="refresh">↻</button></div><div class="file-list" data-file-list>${files.length ? files.map(file => `<button class="file-card ${selectedFileId === file.id ? 'selected' : ''}" data-file-id="${escapeHTML(file.id)}"><span class="file-glyph">${iconForFile(file)}</span><strong>${escapeHTML(file.name)}</strong><small>${file.type === 'folder' ? 'Folder' : formatDate(new Date(file.modified))}</small></button>`).join('') : '<div class="empty-state">This folder is empty.</div>'}</div><div class="file-status">${files.length} item${files.length === 1 ? '' : 's'} · ${escapeHTML(currentFolder)}</div></section></div>`;
  }
  function visibleFiles() {
    const list = currentFolder === 'Home' ? state.files : state.files.filter(file => file.location === currentFolder);
    const filtered = list.filter(file => file.name.toLowerCase().includes(fileQuery.toLowerCase()));
    return filtered.sort((a, b) => fileSort === 'modified' ? b.modified - a.modified : fileSort === 'type' ? a.type.localeCompare(b.type) : a.name.localeCompare(b.name));
  }
  function rerenderApp(id) {
    const win = getAppWindow(id); if (!win) return;
    const activeElement = document.activeElement; const keep = activeElement?.classList.contains('file-search') || activeElement?.classList.contains('global-search');
    $('.window-body', win).innerHTML = appContent(id);
    if (keep) { const input = $('.file-search', win); input?.focus(); input?.setSelectionRange(input.value.length, input.value.length); }
  }
  function notesMarkup() {
    const textFiles = state.files.filter(file => file.type === 'text');
    const current = newNoteDraft ? null : (textFiles.find(file => file.id === activeNoteId) || textFiles[0] || null);
    if (current) activeNoteId = current.id;
    const content = current ? (state.drafts[current.id] ?? current.content) : (state.drafts.new || '');
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    return `<div class="editor-shell"><div class="editor-toolbar"><select class="note-select" aria-label="Open document"><option value="" ${!current ? 'selected' : ''}>New draft</option>${textFiles.map(file => `<option value="${escapeHTML(file.id)}" ${current?.id === file.id ? 'selected' : ''}>${escapeHTML(file.name)}</option>`).join('')}</select><button data-action="note-new">New</button><button data-action="note-open">Open</button><button data-action="note-save">Save</button><button data-action="note-save-as">Save as</button><button data-action="note-rename">Rename</button><button data-action="note-delete">Delete</button></div><textarea class="note-editor" spellcheck="true" placeholder="Start with a blank page...">${escapeHTML(content)}</textarea><div class="editor-meta"><span>${current ? escapeHTML(current.name) : 'Unsaved draft'}</span><span class="note-count">${content.length} characters · ${words} words</span></div></div>`;
  }
  function saveDraft() {
    const editor = $('.note-editor', getAppWindow('notes')); if (!editor) return;
    if (activeNoteId) state.drafts[activeNoteId] = editor.value; else state.drafts.new = editor.value;
    persist();
  }
  function calculatorMarkup() {
    const keys = ['AC', '⌫', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '±', '0', '.', '='];
    return `<div class="calc-shell"><div class="calc-display"><div class="calc-expression">${escapeHTML(calcExpression)}</div><div class="calc-result" data-calc-result>0</div></div><div class="calc-grid">${keys.map(key => `<button class="calc-key ${['÷', '×', '−', '+', '%'].includes(key) ? 'operator' : ''} ${key === '=' ? 'equals' : ''}" data-calc="${key}">${key}</button>`).join('')}</div><div class="calc-history" data-calc-history>${(state.calcHistory || []).slice(0, 3).map(row => `<div><span>${escapeHTML(row.expression)}</span><strong>${escapeHTML(row.result)}</strong></div>`).join('')}</div></div>`;
  }
  function browserMarkup() {
    return `<div class="browser-shell"><div class="browser-tabs"><button class="browser-tab active" data-browser-tab="1">New tab</button><button class="browser-tab add-tab" data-action="browser-new-tab" title="New tab">＋</button></div><div class="browser-bar"><button data-action="browser-back" title="Back" aria-label="Back">←</button><button data-action="browser-forward" title="Forward" aria-label="Forward">→</button><button data-action="browser-refresh" title="Reload" aria-label="Reload">↻</button><button data-action="browser-home" title="Home" aria-label="Home">⌂</button><form class="browser-address-form"><input class="browser-address" aria-label="Search Google or enter a web address" placeholder="Search Google or enter a web address" value="https://www.google.com"></form><button data-action="browser-bookmark" title="Bookmark" aria-label="Bookmark">☆</button></div><div class="browser-bookmarks">${state.bookmarks.map(site => `<button data-site="${escapeHTML(site)}">☆ ${escapeHTML(site.replace(/^https?:\/\//, '').replace('.nova', ''))}</button>`).join('')}</div><div class="browser-page" data-browser-page></div></div>`;
  }
  function terminalMarkup() {
    const albanian = state.settings.language === 'sq';
    return `<div class="terminal-shell"><div class="terminal-output" data-terminal-output><div>${albanian ? 'Terminali Nova OS [Versioni 1.0]' : 'Nova OS Terminal [Version 1.0]'}</div><div>${albanian ? 'Shkruani ' : 'Type '}<span style="color:var(--accent)">help</span>${albanian ? ' për të eksploruar. Shkruani ' : ' to explore. Type '}<span style="color:var(--accent)">matrix</span>${albanian ? ' për një devijim të vogël.' : ' for a little detour.'}</div><br></div><form class="terminal-form"><label>${escapeHTML(state.user.computerName.toLowerCase())}&nbsp;›</label><input aria-label="Terminal command" autocomplete="off" spellcheck="false"></form></div>`;
  }
  function settingsMarkup(section) {
    const sections = ['Personalization', 'System', 'Notifications', 'Privacy', 'About'];
    let content = '';
    if (section === 'Personalization') content = `<div class="settings-section"><h3>Appearance</h3><div class="setting-row"><span>Language</span><select data-setting="language"><option value="en" ${state.settings.language === 'en' ? 'selected' : ''}>English</option><option value="sq" ${state.settings.language === 'sq' ? 'selected' : ''}>Shqip (Albanian)</option></select></div><div class="setting-row"><span>Color mode<small>Choose a comfortable workspace</small></span><select data-setting="theme"><option value="dark" ${state.settings.theme === 'dark' ? 'selected' : ''}>Dark</option><option value="light" ${state.settings.theme === 'light' ? 'selected' : ''}>Light</option></select></div><div class="setting-row"><span>Accent color</span><input type="color" data-setting="accent" value="${escapeHTML(state.settings.accent)}"></div><div class="setting-row"><span>Wallpaper</span><div class="wallpaper-swatches">${['linear-gradient(135deg,#18253c,#9a8e79)', 'linear-gradient(145deg,#19283b,#467572 58%,#f1af6b)', 'linear-gradient(135deg,#20364b,#8ed8c4)', 'linear-gradient(135deg,#29263b,#d2ae91)'].map((bg, index) => `<button class="wallpaper-swatch ${state.settings.wallpaper !== 'custom' && Number(state.settings.wallpaper) === index ? 'selected' : ''}" style="background:${bg}" data-wallpaper="${index}" aria-label="Wallpaper ${index + 1}"></button>`).join('')}${state.settings.customWallpaper ? `<button class="wallpaper-swatch custom-wallpaper-swatch ${state.settings.wallpaper === 'custom' ? 'selected' : ''}" style="background-image:url('${escapeHTML(state.settings.customWallpaper)}')" data-wallpaper="custom" aria-label="Custom photo"></button>` : ''}</div></div><div class="setting-row"><span>Custom photo<small>Choose an image file up to 15 MB.</small></span><div class="wallpaper-custom-controls"><label class="wallpaper-upload-button">Choose photo<input type="file" data-wallpaper-upload accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,image/tiff" aria-label="Choose a custom wallpaper photo"></label>${state.settings.customWallpaper ? '<button class="wallpaper-remove-button" data-action="wallpaper-remove">Remove photo</button>' : ''}</div></div></div><div class="settings-section"><h3>Desktop</h3><div class="setting-row"><span>Taskbar position</span><select data-setting="taskbarPosition"><option value="bottom" ${state.settings.taskbarPosition === 'bottom' ? 'selected' : ''}>Bottom</option><option value="top" ${state.settings.taskbarPosition === 'top' ? 'selected' : ''}>Top</option><option value="left" ${state.settings.taskbarPosition === 'left' ? 'selected' : ''}>Left</option></select></div><div class="setting-row"><span>Desktop icon size</span><select data-setting="iconSize"><option value="small" ${state.settings.iconSize === 'small' ? 'selected' : ''}>Small</option><option value="medium" ${state.settings.iconSize === 'medium' ? 'selected' : ''}>Medium</option><option value="large" ${state.settings.iconSize === 'large' ? 'selected' : ''}>Large</option></select></div></div><div class="settings-section"><h3>Account security</h3><div class="setting-row"><span>Lock screen PIN</span><button data-action="change-pin">Change PIN</button></div></div>`;
    if (section === 'System') content = `<div class="settings-section"><h3>Device specifications</h3>${[['Edition', 'Nova OS Simulator'], ['Version', '1.0.0'], ['Browser engine', 'JavaScript'], ['Computer name', escapeHTML(state.user.computerName)], ['Memory', 'Simulated · 8 GB'], ['Storage', `${(JSON.stringify(state.files).length / 1024).toFixed(1)} KB used locally`]].map(row => `<div class="setting-row"><span>${row[0]}</span><span>${row[1]}</span></div>`).join('')}<button data-open-app="performance">Open performance dashboard</button></div>`;
    if (section === 'Notifications') content = `<div class="settings-section"><h3>Notification preferences</h3><div class="setting-row"><span>Show notifications<small>Application alerts and system messages</small></span><input type="checkbox" data-setting="notifications" ${state.settings.notifications ? 'checked' : ''}></div><div class="setting-row"><span>Notification sounds</span><input type="checkbox" data-setting="sounds" ${state.settings.sounds ? 'checked' : ''}></div><button data-action="fake-message">Send a test message</button></div>`;
    if (section === 'Privacy') content = `<div class="settings-section"><h3>Local data</h3><p class="settings-subtitle">Your files and settings are stored in this browser on this device.</p><div class="setting-row"><span>Clear notification history</span><button data-action="clear-notifications">Clear</button></div><div class="setting-row"><span>Reset settings<small>Restore appearance and notification defaults</small></span><button data-action="reset-settings">Reset settings</button></div><div class="setting-row"><span>Reset Nova OS<small>Delete local files, notes, and simulator settings</small></span><button class="danger-button" data-action="reset-os">Reset OS</button></div></div>`;
    if (section === 'About') content = `<div class="settings-section"><div class="profile-preview"><div class="boot-mark" style="font-size:44px">N<span>.</span></div><div><h3>Nova OS Simulator</h3><small class="settings-subtitle">Version 1.0.0 · Stable</small></div></div><p class="settings-subtitle">A browser desktop made with HTML, CSS &amp; JavaScript. Everything stays on this device.</p><div class="setting-row"><span>Computer</span><span>${escapeHTML(state.user.computerName)}</span></div><div class="setting-row"><span>Signed in as</span><span>${escapeHTML(state.user.username)}</span></div><button data-open-app="profile">Manage your account</button></div>`;
    if (section === 'Privacy') content += `<div class="settings-section"><h3>Passcode options</h3><div class="setting-row"><span>Change lock screen passcode<small>Choose a new 4 to 12 digit PIN.</small></span><button data-action="change-pin">Change PIN</button></div><div class="setting-row"><span>Remove passcode<small>${state.settings.pin ? 'Unlock without entering a PIN.' : 'The lock screen already has no passcode.'}</small></span><button class="danger-button" data-action="remove-pin" ${state.settings.pin ? '' : 'disabled'}>Remove passcode</button></div></div>`;
    return `<div class="settings-shell"><nav class="settings-nav">${sections.map(item => `<button class="side-item ${section === item ? 'selected' : ''}" data-settings-section="${item}">${({ Personalization: '◐', System: '▣', Notifications: '♧', Privacy: '◇', About: 'ⓘ' })[item]} &nbsp;${item}</button>`).join('')}</nav><section class="settings-main"><h2>${section}</h2><p class="settings-subtitle">${section === 'Personalization' ? 'Make this workspace feel like yours.' : section === 'System' ? 'A quick view of this simulated device.' : section === 'Privacy' ? 'Manage the data stored in this browser.' : section === 'About' ? 'A small desktop, made for the web.' : 'Choose which alerts you receive.'}</p>${content}</section></div>`;
  }
  function recycleMarkup() {
    return `<div class="app-toolbar"><button data-action="empty-recycle" ${state.recycle.length ? '' : 'disabled'}>Empty recycle bin</button><span class="toolbar-spacer"></span><span style="font-size:10px;color:#9eabbe">${state.recycle.length} item${state.recycle.length === 1 ? '' : 's'}</span></div><div class="file-list">${state.recycle.length ? state.recycle.map(file => `<div class="file-card"><span class="file-glyph">${iconForFile(file)}</span><strong>${escapeHTML(file.name)}</strong><small>Deleted ${formatDate(new Date(file.deletedAt))}</small><div style="display:flex;gap:4px"><button data-restore="${escapeHTML(file.id)}" title="Restore">↶</button><button data-permanent-delete="${escapeHTML(file.id)}" title="Delete permanently">×</button></div></div>`).join('') : '<div class="empty-state">Recycle Bin is empty.</div>'}</div>`;
  }
  function performanceMarkup() {
    return `<div class="performance-grid">${[['CPU', 'cpu'], ['Memory', 'ram'], ['Storage', 'storage'], ['Network', 'network']].map(([label, id]) => `<div class="metric-card" data-metric="${id}"><div class="metric-head"><span>${label}</span><span data-metric-value>--%</span></div><div class="metric-value" data-metric-large>--%</div><div class="metric-bar"><i></i></div><div class="chart"></div></div>`).join('')}</div>`;
  }
  function profileMarkup() {
    return `<section class="settings-main"><h2>Your account</h2><p class="settings-subtitle">Personalize the details shown around Nova OS.</p><form class="profile-form"><div class="profile-preview"><span class="avatar" data-profile-avatar></span><span><strong>${escapeHTML(state.user.username)}</strong><small class="settings-subtitle">This computer</small></span></div><label>Language<select name="language" data-setting="language"><option value="en" ${state.settings.language === 'en' ? 'selected' : ''}>English</option><option value="sq" ${state.settings.language === 'sq' ? 'selected' : ''}>Shqip (Albanian)</option></select></label><label>Profile picture URL<input name="picture" type="text" placeholder="https://example.com/photo.jpg" value="${escapeHTML(state.user.picture)}"></label><label>Your name<input name="username" type="text" maxlength="30" required value="${escapeHTML(state.user.username)}"></label><label>Computer name<input name="computerName" type="text" maxlength="24" required value="${escapeHTML(state.user.computerName)}"></label><button class="primary-button" type="submit">Save changes</button></form></section>`;
  }
  function bindBrowser(win) {
    const page = $('[data-browser-page]', win); if (!page) return;
    const home = 'https://www.google.com';
    const browser = { tabs: [{ id: 1, title: 'New tab', history: [home], index: 0 }], activeId: 1, nextId: 2 };
    const activeTab = () => browser.tabs.find(tab => tab.id === browser.activeId);
    const render = (address = activeTab().history[activeTab().index]) => {
      const tab = activeTab(); tab.address = address; tab.title = address === home ? 'New tab' : new URL(address).hostname;
      $('.browser-address', win).value = address;
      const hostname = new URL(address).hostname.toLowerCase();
      const blockedByEmbedding = hostname.startsWith('google.')
        || hostname === 'youtu.be' || hostname.endsWith('.youtu.be')
        || hostname === 'youtube.com' || hostname.endsWith('.youtube.com')
        || hostname === 'chatgpt.com' || hostname.endsWith('.chatgpt.com')
        || hostname === 'openai.com' || hostname.endsWith('.openai.com');
      const openFullWebsite = `<button type="button" class="browser-inline-action" data-action="browser-open-full" data-browser-address="${escapeHTML(address)}">Open full website ↗</button>`;
      page.innerHTML = blockedByEmbedding
        ? `<div class="browser-external-only"><strong>${escapeHTML(hostname)} doesn’t allow itself to be shown inside Nova OS.</strong><span>Open the full site in this tab. Use your browser’s Back button to return to Nova OS.</span>${openFullWebsite}</div>`
        : `<iframe class="browser-frame" src="${escapeHTML(address)}" title="${escapeHTML(tab.title)}" referrerpolicy="strict-origin-when-cross-origin"></iframe><div class="browser-frame-fallback"><span>If this site blocks embedding, open the full site here. Use your browser’s Back button to return to Nova OS.</span>${openFullWebsite}</div>`;
      renderBrowserTabs(win);
    };
    browser.render = render;
    browser.navigate = input => {
      const address = normalizeWebAddress(input);
      if (!address) { toast('Invalid web address', 'Enter a valid web address or search term.'); return; }
      const tab = activeTab(); tab.history = tab.history.slice(0, tab.index + 1); tab.history.push(address); tab.index++; render(address);
    };
    browser.go = offset => { const tab = activeTab(); tab.index = Math.max(0, Math.min(tab.history.length - 1, tab.index + offset)); render(tab.history[tab.index]); };
    browser.selectTab = id => { if (browser.tabs.some(tab => tab.id === id)) { browser.activeId = id; render(); } };
    browser.addTab = () => { const id = browser.nextId++; browser.tabs.push({ id, title: 'New tab', history: [home], index: 0 }); browser.activeId = id; render(); };
    browser.closeTab = id => {
      if (browser.tabs.length === 1) { browser.tabs[0] = { id: browser.nextId++, title: 'New tab', history: [home], index: 0 }; browser.activeId = browser.tabs[0].id; }
      else { const index = browser.tabs.findIndex(tab => tab.id === id); browser.tabs = browser.tabs.filter(tab => tab.id !== id); if (browser.activeId === id) browser.activeId = browser.tabs[Math.max(0, index - 1)].id; }
      render();
    };
    win._browser = browser; render();
  }
  function renderBrowserTabs(win) {
    const browser = win._browser; const holder = $('.browser-tabs', win); if (!browser || !holder) return;
    holder.innerHTML = `${browser.tabs.map(tab => `<button class="browser-tab ${tab.id === browser.activeId ? 'active' : ''}" data-browser-tab="${tab.id}"><span>${escapeHTML(tab.title)}</span><span class="tab-close" data-browser-close="${tab.id}" aria-label="Close tab">×</span></button>`).join('')}<button class="browser-tab add-tab" data-action="browser-new-tab" title="New tab">＋</button>`;
  }
  function normalizeWebAddress(input) {
    const value = String(input || '').trim();
    if (!value) return 'https://www.google.com';
    if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^https?:/i.test(value)) return null;
    const address = /^https?:\/\//i.test(value) ? value : value.includes('.') && !/\s/.test(value) ? `https://${value}` : `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    try {
      const parsed = new URL(address);
      return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : null;
    } catch { return null; }
  }
  function renderStartMenu() {
    const menu = $('#startMenu');
    menu.innerHTML = `<div class="start-top"><span class="avatar" data-start-avatar></span><div><strong>${escapeHTML(state.user.username)}</strong><small>${escapeHTML(state.user.computerName)}</small></div><button class="text-button" data-open-app="profile" style="margin-left:auto">Account</button></div><input class="start-search" placeholder="Search apps and files" aria-label="Search apps and files"><div class="start-section-head"><span>Pinned</span><button class="text-button" data-show-all>All apps&nbsp; →</button></div><div class="start-app-grid">${APP_DEFS.slice(0, 8).map(app => `<button class="start-app" data-launch="${app.id}"><span class="app-glyph">${app.icon}</span><span>${escapeHTML(app.name)}</span></button>`).join('')}</div><div class="start-section-head"><span>Recently opened</span></div><div class="start-recent">${state.recent.slice(0, 4).map(id => `<button class="recent-item" data-launch="${id}">${appDef(id).icon}<span>${escapeHTML(appDef(id).name)}</span></button>`).join('') || '<span style="padding:8px;color:#9eabbe;font-size:10px">Your recent apps will show up here.</span>'}</div><div class="start-footer"><button data-open-app="profile">◉ &nbsp;${escapeHTML(state.user.username)}</button><button data-action="power-menu">⏻ &nbsp;Power</button></div><div class="power-options is-hidden"><button data-action="lock">Lock</button><button data-action="restart">Restart Simulator</button><button data-action="shutdown">Shut Down Simulator</button></div>`;
    setAvatar($('[data-start-avatar]', menu));
    translateElement(menu);
  }
  function openSearch(initial = '') {
    const panel = $('#searchPanel'); panel.classList.remove('is-hidden');
    panel.innerHTML = `<input class="global-search" placeholder="Search apps, files, settings, and notes" aria-label="Search everything" value="${escapeHTML(initial)}"><div class="search-results"></div>`;
    renderSearchResults(initial); $('.global-search', panel).focus(); closePanels(panel);
  }
  function renderSearchResults(query) {
    const results = $('.search-results', $('#searchPanel')); if (!results) return;
    const q = query.trim().toLowerCase();
    const matches = [];
    APP_DEFS.forEach(app => { if (!q || app.name.toLowerCase().includes(q)) matches.push({ icon: app.icon, title: app.name, detail: 'Application', action: `app:${app.id}` }); });
    state.files.forEach(file => { if (q && `${file.name} ${file.content || ''}`.toLowerCase().includes(q)) matches.push({ icon: iconForFile(file), title: file.name, detail: `File · ${file.location}`, action: `file:${file.id}` }); });
    if ('personalization system notifications privacy about'.includes(q) && q) matches.push({ icon: '⚙️', title: 'Settings', detail: 'Settings', action: 'app:settings' });
    results.innerHTML = matches.slice(0, 12).map(item => `<button class="search-result" data-search-action="${escapeHTML(item.action)}"><span class="app-glyph">${item.icon}</span><span>${escapeHTML(item.title)}<small>${escapeHTML(item.detail)}</small></span></button>`).join('') || '<p class="empty-state">No matches yet.</p>';
  }
  function renderNotificationDot() { $('#notificationDot').classList.toggle('is-hidden', !state.notifications.length); }
  function openNotifications() {
    const panel = $('#notificationPanel'); panel.classList.remove('is-hidden');
    panel.innerHTML = `<div class="panel-head"><h2>Notifications</h2><button class="text-button" data-action="clear-notifications">Clear all</button></div>${state.notifications.length ? state.notifications.map(item => `<article class="notification-item"><span class="app-glyph">${escapeHTML(item.icon)}</span><div><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.message)}</p><time>${timeAgo(item.time)}</time></div><button data-dismiss-notification="${escapeHTML(item.id)}" aria-label="Dismiss notification">×</button></article>`).join('') : '<div class="empty-state">You’re all caught up.</div>'}`;
    closePanels(panel);
  }
  const timeAgo = time => { const m = Math.max(0, Math.floor((Date.now() - time) / 60000)); return m < 1 ? 'Just now' : m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`; };
  function renderCalendar() {
    const panel = $('#calendarPanel'); const now = new Date(); const shown = new Date(now.getFullYear(), now.getMonth() + calendarOffset, 1);
    const startDay = new Date(shown.getFullYear(), shown.getMonth(), 1).getDay(); const days = new Date(shown.getFullYear(), shown.getMonth() + 1, 0).getDate();
    const weekdays = state.settings.language === 'sq' ? ['D', 'H', 'M', 'M', 'E', 'P', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const cells = weekdays.map(day => `<span class="weekday">${day}</span>`);
    for (let i = 0; i < startDay; i++) cells.push('<span></span>');
    for (let day = 1; day <= days; day++) cells.push(`<span class="${calendarOffset === 0 && day === now.getDate() ? 'today' : ''}">${day}</span>`);
    panel.innerHTML = `<div class="calendar-now">${formatTime(now, { hour: 'numeric', minute: '2-digit' })}</div><div class="calendar-full-date">${formatDate(now, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div><div class="calendar-nav"><button data-calendar="prev">‹</button><strong>${formatDate(shown, { month: 'long', year: 'numeric' })}</strong><button data-calendar="next">›</button></div><div class="calendar-grid">${cells.join('')}</div>`;
  }
  function closePanels(except = null) {
    ['startMenu', 'searchPanel', 'notificationPanel', 'calendarPanel', 'volumePanel'].forEach(id => { const panel = $(`#${id}`); if (panel !== except) panel.classList.add('is-hidden'); });
    $('#contextMenu').classList.add('is-hidden');
  }
  function togglePanel(id, render) {
    const panel = $(`#${id}`); const opening = panel.classList.contains('is-hidden'); closePanels(opening ? panel : null);
    if (!opening) return;
    if (render) render(); panel.classList.remove('is-hidden');
  }
  function newFile(type, name, location = currentFolder === 'Home' ? 'Desktop' : currentFolder) {
    const baseName = name || (type === 'folder' ? 'New folder' : 'New document.txt');
    const file = { id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: baseName, type, location, content: type === 'text' ? '' : '', modified: Date.now() };
    state.files.push(file); selectedFileId = file.id; persist(); notify(type === 'folder' ? 'Folder created' : 'File created', baseName, iconForFile(file));
    return file;
  }
  function deleteFile(id) {
    const index = state.files.findIndex(file => file.id === id); if (index < 0) return;
    const [file] = state.files.splice(index, 1); file.deletedAt = Date.now(); state.recycle.unshift(file);
    delete state.drafts[id]; persist(); notify('Moved to Recycle Bin', `${file.name} can be restored later.`, '🗑️');
  }
  function showModal(title, message, defaultValue, callback, confirmText = 'Save') {
    const layer = $('#modalLayer'); layer.innerHTML = `<div class="modal-backdrop"><form class="modal-box"><h2>${escapeHTML(title)}</h2><p>${escapeHTML(message)}</p>${defaultValue !== null ? `<input name="value" autocomplete="off" value="${escapeHTML(defaultValue)}" aria-label="${escapeHTML(title)}">` : ''}<div class="modal-actions"><button type="button" data-action="modal-cancel">Cancel</button><button class="primary-button" type="submit">${escapeHTML(confirmText)}</button></div></form></div>`;
    const form = $('form', layer); if (defaultValue !== null) { $('input', form).focus(); $('input', form).select(); }
    form.addEventListener('submit', event => { event.preventDefault(); const value = $('input', form)?.value; layer.innerHTML = ''; callback(value); });
    $('.modal-backdrop', layer).addEventListener('click', event => { if (event.target.classList.contains('modal-backdrop')) layer.innerHTML = ''; });
  }
  function showDesktopContextMenu(event) {
    event.preventDefault();
    const menu = $('#contextMenu');
    const layout = state.settings.desktopIconLayout;
    menu.innerHTML = `<button class="context-menu-row" role="menuitem" data-action="desktop-refresh"><span class="context-menu-icon">↻</span><span>Refresh</span></button>
      <div class="context-menu-divider"></div>
      <div class="context-menu-group">
        <button class="context-menu-row context-submenu-trigger" role="menuitem" aria-haspopup="true" aria-expanded="false" data-action="desktop-toggle-layout"><span class="context-menu-icon">▦</span><span>Icon arrangement</span><span class="context-menu-chevron">›</span></button>
        <div class="context-submenu" role="menu" aria-label="Icon arrangement">
          <button class="context-menu-row" role="menuitemradio" aria-checked="${layout === 'free'}" data-action="desktop-layout-free"><span class="context-menu-icon">↗</span><span>Free form</span><span class="context-menu-check">${layout === 'free' ? '✓' : ''}</span></button>
          <button class="context-menu-row" role="menuitemradio" aria-checked="${layout === 'grid'}" data-action="desktop-layout-grid"><span class="context-menu-icon">▦</span><span>Align to grid</span><span class="context-menu-check">${layout === 'grid' ? '✓' : ''}</span></button>
        </div>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-group">
        <button class="context-menu-row context-submenu-trigger" role="menuitem" aria-haspopup="true" aria-expanded="false" data-action="desktop-toggle-new"><span class="context-menu-icon">＋</span><span>New</span><span class="context-menu-chevron">›</span></button>
        <div class="context-submenu" role="menu" aria-label="New">
          <button class="context-menu-row" role="menuitem" data-action="desktop-new-folder"><span class="context-menu-icon">📁</span><span>New folder</span></button>
          <button class="context-menu-row" role="menuitem" data-action="desktop-new-file"><span class="context-menu-icon">📝</span><span>New text file</span></button>
        </div>
      </div>
      <div class="context-menu-divider"></div>
      <button class="context-menu-row" role="menuitem" data-open-app="settings"><span class="context-menu-icon">⚙</span><span>Personalize</span></button>`;
    menu.classList.add('desktop-context-menu');
    menu.classList.remove('is-hidden');
    const desktopRect = $('#desktop').getBoundingClientRect();
    const left = Math.max(5, Math.min(event.clientX - desktopRect.left, desktopRect.width - menu.offsetWidth - 5));
    const top = Math.max(5, Math.min(event.clientY - desktopRect.top, desktopRect.height - menu.offsetHeight - 5));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.classList.toggle('opens-left', left + menu.offsetWidth + 214 > desktopRect.width);
  }
  function showFileContext(event, fileId = null) {
    event.preventDefault(); const menu = $('#contextMenu'); selectedFileId = fileId;
    menu.classList.remove('desktop-context-menu', 'opens-left');
    const entries = fileId ? [['open', 'Open'], ['rename', 'Rename'], ['move', 'Move to…'], ['delete', 'Delete'], ['properties', 'Properties'], ['refresh', 'Refresh']] : [['new-folder', 'New Folder'], ['new-file', 'New Text File'], ['refresh', 'Refresh']];
    menu.innerHTML = entries.map(([action, label]) => `<button role="menuitem" data-action="${action}" data-context-file="${escapeHTML(fileId || '')}">${label}</button>`).join('');
    const desktopRect = $('#desktop').getBoundingClientRect(); menu.style.left = `${Math.max(5, Math.min(event.clientX - desktopRect.left, desktopRect.width - 180))}px`; menu.style.top = `${Math.max(5, Math.min(event.clientY - desktopRect.top, desktopRect.height - 170))}px`; menu.classList.remove('is-hidden');
  }
  function actOnFile(action, id) {
    const file = state.files.find(item => item.id === id);
    if (action === 'new-folder') showModal('Create a folder', 'Name your new folder.', 'New folder', value => { if (value?.trim()) { newFile('folder', value.trim()); rerenderApp('files'); } });
    else if (action === 'new-file') showModal('Create a text file', 'Name your new text file.', 'New document.txt', value => { if (value?.trim()) { const item = newFile('text', value.trim()); selectedFileId = item.id; rerenderApp('files'); } });
    else if (!file) return;
    else if (action === 'open') openFile(file);
    else if (action === 'delete') { deleteFile(id); rerenderApp('files'); rerenderApp('recycle'); }
    else if (action === 'rename') showModal('Rename item', 'Choose a new name for this item.', file.name, value => { if (value?.trim()) { file.name = value.trim(); file.modified = Date.now(); persist(); rerenderApp('files'); notify('File renamed', file.name, iconForFile(file)); } });
    else if (action === 'move') showModal('Move item', 'Enter Desktop, Documents, Downloads, Pictures, Music, or Videos.', file.location, value => { const place = ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Music', 'Videos'].find(item => item.toLowerCase() === value?.trim().toLowerCase()); if (place) { file.location = place; file.modified = Date.now(); persist(); rerenderApp('files'); notify('File moved', `${file.name} · ${place}`, iconForFile(file)); } else toast('Choose a known folder', 'Try Documents, Downloads, Pictures, Music, Videos, or Desktop.'); });
    else if (action === 'properties') showModal(file.name, `Type: ${file.type}\nLocation: ${file.location}\nModified: ${formatDate(new Date(file.modified), { year: 'numeric', month: 'long', day: 'numeric' })}\n${file.type === 'text' ? `Characters: ${file.content.length}` : ''}`, null, () => {}, 'Done');
    else if (action === 'refresh') rerenderApp('files');
  }
  function openFile(file) {
    if (file.type === 'folder') { currentFolder = file.location === 'Home' ? file.name : `${file.location}/${file.name}`; rerenderApp('files'); return; }
    if (file.type === 'text') { activeNoteId = file.id; newNoteDraft = false; openApp('notes'); rerenderApp('notes'); }
    else showModal(file.name, `${file.content || 'No preview available.'}\n\nLocation: ${file.location}`, null, () => {}, 'Close');
  }
  function calcPress(key, win) {
    const result = $('[data-calc-result]', win); if (!result) return;
    if (key === 'AC') calcExpression = '';
    else if (key === '⌫') calcExpression = calcExpression.slice(0, -1);
    else if (key === '±') calcExpression = calcExpression.startsWith('-') ? calcExpression.slice(1) : `-${calcExpression}`;
    else if (key === '=') {
      const value = evaluateExpression(calcExpression);
      if (value !== null) {
        (state.calcHistory ||= []).unshift({ expression: calcExpression, result: String(value) }); state.calcHistory = state.calcHistory.slice(0, 20); result.textContent = String(value); $('.calc-expression', win).textContent = `${calcExpression} =`; calcExpression = String(value); persist(); $('[data-calc-history]', win).innerHTML = state.calcHistory.slice(0, 3).map(row => `<div><span>${escapeHTML(row.expression)}</span><strong>${escapeHTML(row.result)}</strong></div>`).join(''); return;
      }
      result.textContent = 'Error'; calcExpression = ''; return;
    } else calcExpression += ({ '÷': '/', '×': '*', '−': '-', '%': '%' }[key] || key);
    $('.calc-expression', win).textContent = calcExpression;
    const preview = evaluateExpression(calcExpression); result.textContent = preview === null ? (calcExpression ? '…' : '0') : String(preview);
  }
  function evaluateExpression(expression) {
    if (!expression || !/^[\d+\-*/().%\s]+$/.test(expression)) return null;
    const normalized = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)').replace(/[+\-*/.]\s*$/, '');
    if (!normalized) return null;
    try { const value = Function(`"use strict"; return (${normalized})`)(); return Number.isFinite(value) ? Number(value.toPrecision(11)) : null; } catch { return null; }
  }
  function terminalPrint(win, text, className = '') {
    const output = $('[data-terminal-output]', win); if (!output) return;
    const line = document.createElement('div'); line.className = className; line.textContent = text; output.append(line); output.scrollTop = output.scrollHeight;
  }
  function runCommand(win, command) {
    const raw = command.trim(); if (!raw) return;
    terminalPrint(win, `${state.user.computerName.toLowerCase()} › ${raw}`, 'terminal-line');
    terminalHistory.unshift(raw); terminalHistoryIndex = -1;
    const [base, ...args] = raw.split(' '); const lower = base.toLowerCase(); const rest = args.join(' ');
    const print = text => terminalPrint(win, text);
    if (lower === 'help') print('help  clear  date  time  whoami  about  apps  files  pwd  ls  echo\ncalculator  systeminfo  neofetch\nTry sudo, matrix, coffee, 42, or konami.');
    else if (lower === 'clear') $('[data-terminal-output]', win).innerHTML = '';
    else if (lower === 'date') print(formatDate(new Date(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    else if (lower === 'time') print(formatTime(new Date()));
    else if (lower === 'whoami') print(`${state.user.username} · ${state.user.computerName}`);
    else if (lower === 'about') print('Nova OS Simulator 1.0 · built with HTML, CSS & JavaScript.');
    else if (lower === 'apps') print(APP_DEFS.map(app => app.name).join('  ·  '));
    else if (lower === 'files' || lower === 'ls' || lower === 'dir') print((currentFolder === 'Home' ? state.files : state.files.filter(file => file.location === currentFolder)).map(file => `${iconForFile(file)} ${file.name}`).join('\n') || 'This folder is empty.');
    else if (lower === 'pwd') print(`/Users/${state.user.username.replace(/\s/g, '_')}/${currentFolder}`);
    else if (lower === 'echo') print(rest);
    else if (lower === 'systeminfo') print(`OS: Nova OS Simulator\nVersion: 1.0\nBrowser Engine: JavaScript\nMemory: Simulated\nStorage: LocalStorage\nComputer: ${state.user.computerName}`);
    else if (lower === 'neofetch') print(`       .--.      ${state.user.username}\n      |o_o |     Nova OS 1.0\n      |:_/ |     JavaScript\n     //   \\ \\    LocalStorage\n    (|     | )\n   /'\\_   _/\u0060\\`);
    else if (lower === 'calculator') { print('Opening calculator…'); openApp('calculator'); }
    else if (lower === 'sudo') print('Nice try. You already have enough power to make a very good cup of tea.');
    else if (lower === 'matrix') { print('Wake up, Nova…'); activateMatrix(); }
    else if (lower === 'konami') { print('Secret mode unlocked: the desktop is yours. ↑ ↑ ↓ ↓ ← → ← → B A'); document.body.classList.toggle('secret-mode'); toast('Secret mode', 'You found the quiet switch.', '✦'); }
    else if (lower === 'coffee') { print('Brewing a fresh cup of ☕. Productivity is now an optional setting.'); notify('Coffee break', 'The simulated kettle is on.', '☕'); }
    else if (lower === '42') print('The answer is 42. The question is probably in your Documents folder.');
    else if (lower === 'sudo rm' || raw.toLowerCase().includes('rm -rf')) print('Absolutely not. Your files are safer than that.');
    else if (lower === 'open' && rest) openApp(rest.toLowerCase());
    else print(`Command not found: ${base}. Try "help".`);
  }
  function activateMatrix() {
    const layer = $('#matrixLayer'); const canvas = $('#matrixCanvas'); layer.classList.remove('is-hidden');
    const ctx = canvas.getContext('2d'); const chars = 'アイウエオカキクケコ012345789NOVＡ'; let drops = [];
    const resize = () => { canvas.width = Math.floor(layer.clientWidth * devicePixelRatio); canvas.height = Math.floor(layer.clientHeight * devicePixelRatio); ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); drops = Array(Math.ceil(layer.clientWidth / 17)).fill(1); };
    resize(); window.addEventListener('resize', resize, { once: true }); cancelAnimationFrame(matrixAnimation);
    const draw = () => {
      if (layer.classList.contains('is-hidden')) return;
      ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(0, 0, layer.clientWidth, layer.clientHeight); ctx.fillStyle = '#75f2a2'; ctx.font = '14px monospace';
      drops.forEach((y, index) => { ctx.fillText(chars[Math.floor(Math.random() * chars.length)], index * 17, y * 17); if (y * 17 > layer.clientHeight && Math.random() > .98) drops[index] = 0; drops[index]++; });
      matrixAnimation = requestAnimationFrame(draw);
    };
    draw();
  }
  function startPerformance(win) {
    clearInterval(performanceTimer);
    performanceTimer = setInterval(() => {
      if (!win.isConnected) { clearInterval(performanceTimer); return; }
      $$('.metric-card', win).forEach(card => {
        const id = card.dataset.metric; const value = id === 'storage' ? Math.floor(30 + state.files.length * 2 + Math.random() * 3) : id === 'network' ? Math.floor(8 + Math.random() * 72) : Math.floor(16 + Math.random() * 68);
        $('[data-metric-value]', card).textContent = `${value}%`; $('[data-metric-large]', card).textContent = id === 'network' ? `${(value * .34).toFixed(1)} Mbps` : `${value}%`; $('.metric-bar i', card).style.width = `${value}%`;
        const chart = $('.chart', card); const heights = [...$$('i', chart).map(node => parseInt(node.style.height, 10) || 10), value].slice(-16); chart.innerHTML = heights.map(height => `<i style="height:${Math.max(8, height)}%"></i>`).join('');
      });
    }, 850);
  }
  function updateClock() {
    const now = new Date(); $('#taskbarTime').textContent = formatTime(now, { hour: 'numeric', minute: '2-digit' }); $('#taskbarDate').textContent = formatDate(now, { month: 'numeric', day: 'numeric', year: '2-digit' });
    $('#lockClock').textContent = formatTime(now, { hour: '2-digit', minute: '2-digit' }); $('#lockDate').textContent = formatDate(now, { weekday: 'long', month: 'long', day: 'numeric' });
    if (!$('#calendarPanel').classList.contains('is-hidden')) renderCalendar();
  }
  function updateSetupPasscodeField() {
    const enabled = $('input[name="usePasscode"]:checked', $('#setupForm'))?.value === 'yes';
    $('#setupPinLabel').classList.toggle('is-hidden', !enabled);
    $('#setupPin').classList.toggle('is-hidden', !enabled);
    $('#setupPin').required = enabled;
  }
  function updateLockScreen() {
    const hasPasscode = Boolean(state.settings.pin);
    const input = $('#pinInput'); input.classList.toggle('is-hidden', !hasPasscode); input.required = hasPasscode;
    input.placeholder = hasPasscode ? 'Enter passcode' : ''; input.setAttribute('aria-label', hasPasscode ? 'Enter passcode' : 'No passcode required');
    $('label[for="pinInput"]').classList.toggle('is-hidden', !hasPasscode);
    $('#unlockForm button[type="submit"]').innerHTML = hasPasscode ? 'Unlock <span aria-hidden="true">→</span>' : 'Continue <span aria-hidden="true">→</span>';
    $('#pinError').textContent = hasPasscode ? 'Enter your passcode to continue' : 'No passcode is set. You can continue.';
  }
  function lockOS() { $('#desktopShell').classList.add('is-hidden'); $('#lockScreen').classList.remove('is-hidden'); $('#pinInput').value = ''; updateLockScreen(); }
  function unlockOS(event) {
    event?.preventDefault(); const pin = $('#pinInput').value;
    if (state.settings.pin && pin !== String(state.settings.pin)) { $('#pinError').textContent = 'That passcode did not match. Try again.'; $('#pinInput').select(); return; }
    $('#lockScreen').classList.add('is-hidden'); $('#desktopShell').classList.remove('is-hidden'); $('#pinError').textContent = ''; $('#pinInput').value = ''; applySettings();
  }
  function shutdown() {
    closePanels(); $('#desktopShell').classList.add('is-hidden'); $('#shutdownScreen').classList.remove('is-hidden');
  }
  function resetOS() {
    const profileName = state.user.username;
    const language = state.settings.language;
    state = clone(DEFAULT_STATE); state.user.username = profileName; state.settings.language = language;
    currentFolder = 'Desktop'; selectedFileId = null; activeNoteId = null; newNoteDraft = false; windows().forEach(win => win.remove()); persist(); applySettings(); renderStartMenu(); renderNotificationDot();
    $('#shutdownScreen').classList.add('is-hidden'); $('#desktopShell').classList.add('is-hidden'); $('#lockScreen').classList.remove('is-hidden');
  }
  function init() {
    renderStartMenu(); renderDesktopIcons(); renderTaskbar(); renderNotificationDot(); updateClock(); setInterval(updateClock, 1000);
    $('#setupName').value = state.user.username === 'Nova User' ? '' : state.user.username;
    $('#setupLanguage').value = state.settings.language === 'sq' ? 'sq' : 'en';
    updateSetupPasscodeField();
    const observer = new MutationObserver(records => {
      records.forEach(record => {
        if (record.type === 'characterData') translateTextNode(record.target);
        else record.addedNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
          else if (node.nodeType === Node.ELEMENT_NODE) translateElement(node);
        });
      });
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    translateElement();
    setTimeout(() => {
      $('#bootScreen').classList.add('is-hidden');
      if (needsSetup) { $('#setupScreen').classList.remove('is-hidden'); $('#setupName').focus(); }
      else { $('#lockScreen').classList.remove('is-hidden'); $('#pinInput').focus(); }
    }, 1600);
    $('#setupLanguage').addEventListener('change', event => translateElement(document.body, event.target.value));
    $('#setupForm').addEventListener('change', event => { if (event.target.name === 'usePasscode') updateSetupPasscodeField(); });
    $('#unlockForm').addEventListener('submit', unlockOS);
    $('#startButton').addEventListener('click', () => togglePanel('startMenu', renderStartMenu));
    $('#searchButton').addEventListener('click', () => openSearch());
    $('#notificationButton').addEventListener('click', () => togglePanel('notificationPanel', openNotifications));
    $('#clockButton').addEventListener('click', () => togglePanel('calendarPanel', renderCalendar));
    $('#profileButton').addEventListener('click', () => openApp('profile'));
    $('#trayNetwork').addEventListener('click', () => toast('Network', 'Connected to Nova network.', '◔'));
    $('#trayVolume').addEventListener('click', () => togglePanel('volumePanel', updateVolumeControl));
    $('#trayBattery').addEventListener('click', () => toast('Battery', '86% · Power source: simulated.', '▰'));
    $('#powerOnButton').addEventListener('click', () => { $('#shutdownScreen').classList.add('is-hidden'); $('#lockScreen').classList.remove('is-hidden'); });
    $('#matrixLayer .matrix-close').addEventListener('click', () => { $('#matrixLayer').classList.add('is-hidden'); cancelAnimationFrame(matrixAnimation); });
    $('#desktop').addEventListener('pointerdown', event => { if (event.target === $('#desktop')) closePanels(); });
    $('#desktop').addEventListener('contextmenu', event => {
      if (event.target.closest('.window, #contextMenu, #modalLayer, #matrixLayer')) return;
      showDesktopContextMenu(event);
    });
    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);
    document.addEventListener('change', handleChange);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('contextmenu', event => { const card = event.target.closest('.file-card[data-file-id]'); if (card) showFileContext(event, card.dataset.fileId); else if (event.target.closest('[data-file-list]')) showFileContext(event); });
    document.addEventListener('dblclick', event => { const card = event.target.closest('.file-card[data-file-id]'); if (card) { const file = state.files.find(item => item.id === card.dataset.fileId); if (file) openFile(file); } });
    document.addEventListener('keydown', handleKeydown);
    renderProfileBits(); applySettings();
  }
  function handleClick(event) {
    if (!event.target.closest('#contextMenu')) $('#contextMenu').classList.add('is-hidden');
    const target = event.target.closest('button'); if (!target) return;
    if (target.dataset.launch) { openApp(target.dataset.launch); return; }
    if (target.dataset.window) { const win = getAppWindow(target.dataset.window); if (!win) return; if (win.classList.contains('active-window') && !win.classList.contains('minimized')) { win.classList.add('minimized'); renderTaskbar(); } else focusWindow(win); return; }
    if (target.dataset.windowAction) {
      const win = target.closest('.window');
      if (target.dataset.windowAction === 'close') closeWindow(win);
      if (target.dataset.windowAction === 'minimize') { win.classList.add('minimized'); renderTaskbar(); }
      if (target.dataset.windowAction === 'maximize') toggleMaximize(win);
      return;
    }
    if (target.dataset.folder) { currentFolder = target.dataset.folder; fileQuery = ''; selectedFileId = null; rerenderApp('files'); return; }
    if (target.dataset.fileId) {
      selectedFileId = target.dataset.fileId;
      $$('.file-card[data-file-id]', target.closest('.window')).forEach(card => {
        card.classList.toggle('selected', card.dataset.fileId === selectedFileId);
      });
      return;
    }
    if (target.dataset.action) { handleAction(target.dataset.action, target); return; }
    if (target.dataset.openApp) { openApp(target.dataset.openApp); return; }
    if (target.dataset.settingsSection) { const win = target.closest('.window'); $('.window-body', win).innerHTML = settingsMarkup(target.dataset.settingsSection); return; }
    if (target.dataset.wallpaper !== undefined) { state.settings.wallpaper = target.dataset.wallpaper === 'custom' ? 'custom' : Number(target.dataset.wallpaper); persist(); applySettings(); rerenderApp('settings'); notify('Wallpaper updated', 'Your desktop has a new view.', '◐'); return; }
    if (target.dataset.calc) { calcPress(target.dataset.calc, target.closest('.window')); return; }
    const closeTab = event.target.closest('[data-browser-close]');
    if (closeTab) { target.closest('.window')?._browser?.closeTab(Number(closeTab.dataset.browserClose)); return; }
    if (target.dataset.browserTab) { target.closest('.window')?._browser?.selectTab(Number(target.dataset.browserTab)); return; }
    if (target.dataset.site) { navigateBrowser(target.closest('.window'), target.dataset.site); return; }
    if (target.dataset.searchAction) { const [type, value] = target.dataset.searchAction.split(':'); closePanels(); if (type === 'app') openApp(value); else { const file = state.files.find(item => item.id === value); if (file) openFile(file); } return; }
    if (target.dataset.restore) { const file = state.recycle.find(item => item.id === target.dataset.restore); if (file) { delete file.deletedAt; state.files.push(file); state.recycle = state.recycle.filter(item => item.id !== file.id); persist(); rerenderApp('recycle'); rerenderApp('files'); notify('File restored', file.name, iconForFile(file)); } return; }
    if (target.dataset.permanentDelete) { state.recycle = state.recycle.filter(item => item.id !== target.dataset.permanentDelete); persist(); rerenderApp('recycle'); return; }
    if (target.dataset.dismissNotification) { state.notifications = state.notifications.filter(item => item.id !== target.dataset.dismissNotification); persist(); renderNotificationDot(); openNotifications(); return; }
    if (target.dataset.calendar) { calendarOffset += target.dataset.calendar === 'next' ? 1 : -1; renderCalendar(); return; }
    if (target.hasAttribute('data-show-all')) { $('.start-app-grid', $('#startMenu')).innerHTML = APP_DEFS.map(app => `<button class="start-app" data-launch="${app.id}"><span class="app-glyph">${app.icon}</span><span>${escapeHTML(app.name)}</span></button>`).join(''); target.textContent = 'All apps'; return; }
  }
  function handleAction(action, target) {
    const win = target.closest('.window'); const fileId = target.dataset.contextFile || selectedFileId;
    if (action === 'desktop-refresh') { renderDesktopIcons(); $('#contextMenu').classList.add('is-hidden'); return; }
    if (action === 'desktop-toggle-layout' || action === 'desktop-toggle-new') {
      const group = target.closest('.context-menu-group');
      const open = group.classList.toggle('is-open');
      target.setAttribute('aria-expanded', String(open));
      return;
    }
    if (action === 'desktop-layout-free') {
      state.settings.desktopIconLayout = 'free'; persist(); $('#contextMenu').classList.add('is-hidden'); return;
    }
    if (action === 'desktop-layout-grid') {
      state.settings.desktopIconLayout = 'grid'; arrangeDesktopIconsInGrid(); $('#contextMenu').classList.add('is-hidden'); return;
    }
    if (action === 'desktop-new-folder') {
      showModal('Create a folder', 'Name your new folder.', 'New folder', value => { if (value?.trim()) newFile('folder', value.trim(), 'Desktop'); });
      $('#contextMenu').classList.add('is-hidden'); return;
    }
    if (action === 'desktop-new-file') {
      showModal('Create a text file', 'Name your new text file.', 'New document.txt', value => { if (value?.trim()) newFile('text', value.trim(), 'Desktop'); });
      $('#contextMenu').classList.add('is-hidden'); return;
    }
    if (action.startsWith('new-') || ['open', 'rename', 'move', 'delete', 'properties', 'refresh'].includes(action)) { actOnFile(action, fileId); $('#contextMenu').classList.add('is-hidden'); return; }
    if (action === 'volume-test') {
      const status = $('#volumeStatus');
      status.textContent = state.settings.volume === 0 ? 'Volume is muted.' : playSound() ? 'Test sound played.' : 'Audio is unavailable in this browser.';
      return;
    }
    if (action === 'modal-cancel') { $('#modalLayer').innerHTML = ''; return; }
    if (action === 'power-menu') { $('.power-options', $('#startMenu')).classList.toggle('is-hidden'); return; }
    if (action === 'lock') { closePanels(); lockOS(); return; }
    if (action === 'restart') { closePanels(); windows().forEach(item => item.remove()); $('#desktopShell').classList.add('is-hidden'); $('#lockScreen').classList.add('is-hidden'); $('#shutdownScreen').classList.add('is-hidden'); $('#bootScreen').classList.remove('is-hidden'); setTimeout(() => { $('#bootScreen').classList.add('is-hidden'); $('#lockScreen').classList.remove('is-hidden'); }, 1400); return; }
    if (action === 'shutdown') { shutdown(); return; }
    if (action === 'wallpaper-remove') {
      const previous = { wallpaper: state.settings.wallpaper, customWallpaper: state.settings.customWallpaper };
      state.settings.customWallpaper = '';
      if (state.settings.wallpaper === 'custom') state.settings.wallpaper = 0;
      if (!persist()) {
        state.settings.wallpaper = previous.wallpaper;
        state.settings.customWallpaper = previous.customWallpaper;
        return;
      }
      applySettings(); rerenderApp('settings');
      notify('Wallpaper updated', 'Wallpaper photo removed.', '◐');
      return;
    }
    if (action === 'refresh') { rerenderApp('files'); return; }
    if (action === 'browser-home') { navigateBrowser(win, 'https://www.google.com'); return; }
    if (action === 'browser-open-full') {
      const address = normalizeWebAddress(target.dataset.browserAddress || '');
      if (!address) { toast('Invalid web address', 'Enter a valid web address or search term.'); return; }
      window.location.assign(address);
      return;
    }
    if (action === 'browser-back') { win?._browser?.go(-1); return; }
    if (action === 'browser-forward') { win?._browser?.go(1); return; }
    if (action === 'browser-refresh') { win?._browser?.render(); return; }
    if (action === 'browser-bookmark') { const address = $('.browser-address', win).value; state.bookmarks = state.bookmarks.includes(address) ? state.bookmarks.filter(item => item !== address) : [address, ...state.bookmarks]; persist(); $('.browser-bookmarks', win).innerHTML = state.bookmarks.map(site => `<button data-site="${escapeHTML(site)}">☆ ${escapeHTML(site.replace('.nova', ''))}</button>`).join(''); return; }
    if (action === 'browser-new-tab') { win?._browser?.addTab(); return; }
    if (action === 'browser-close-tab') { win?._browser?.closeTab(Number(target.dataset.browserClose)); return; }
    if (action === 'note-new') { saveDraft(); activeNoteId = null; newNoteDraft = true; rerenderApp('notes'); $('.note-editor', getAppWindow('notes'))?.focus(); return; }
    if (action === 'note-open') { const text = state.files.find(file => file.type === 'text'); if (text) { activeNoteId = text.id; newNoteDraft = false; rerenderApp('notes'); } else toast('No documents found', 'Create a new text file first.'); return; }
    if (action === 'note-save') { saveNote(); return; }
    if (action === 'note-save-as') { showModal('Save document as', 'Choose a name for your text file.', 'Untitled.txt', value => { if (!value?.trim()) return; const file = newFile('text', value.trim(), 'Documents'); file.content = $('.note-editor', getAppWindow('notes'))?.value || ''; activeNoteId = file.id; newNoteDraft = false; persist(); rerenderApp('notes'); notify('Document saved', file.name, '📝'); }); return; }
    if (action === 'note-rename') { const file = state.files.find(item => item.id === activeNoteId); if (file) showModal('Rename document', 'Choose a new document name.', file.name, value => { if (value?.trim()) { file.name = value.trim(); file.modified = Date.now(); persist(); rerenderApp('notes'); notify('Document renamed', file.name, '📝'); } }); return; }
    if (action === 'note-delete') { if (activeNoteId) { deleteFile(activeNoteId); activeNoteId = null; newNoteDraft = true; rerenderApp('notes'); } else { state.drafts.new = ''; persist(); rerenderApp('notes'); } return; }
    if (action === 'change-pin') { showModal('Change passcode', 'Choose a new passcode using 4 to 12 digits.', '', value => { if (/^\d{4,12}$/.test(value || '')) { state.settings.pin = value; persist(); updateLockScreen(); rerenderApp('settings'); notify('Passcode updated', 'Your next unlock will use the new passcode.', '🔒'); } else toast('Passcode not changed', 'Use between 4 and 12 digits.'); }); return; }
    if (action === 'remove-pin') { if (!state.settings.pin) return; showModal('Remove passcode?', 'Anyone with access to this device will be able to unlock Nova OS without a passcode.', null, () => { state.settings.pin = ''; persist(); updateLockScreen(); rerenderApp('settings'); notify('Passcode removed', 'The lock screen no longer requires a passcode.', '🔓'); }, 'Remove passcode'); return; }
    if (action === 'fake-message') { notify('A note from Mina', 'The new desktop is looking good. See you after class!', '✉'); return; }
    if (action === 'clear-notifications') { state.notifications = []; persist(); renderNotificationDot(); if (!$('#notificationPanel').classList.contains('is-hidden')) openNotifications(); return; }
    if (action === 'reset-settings') { state.settings = { ...clone(DEFAULT_STATE.settings), pin: state.settings.pin }; persist(); applySettings(); rerenderApp('settings'); notify('Settings reset', 'Appearance and alerts are back to default.'); return; }
    if (action === 'reset-os') { showModal('Reset Nova OS?', 'This permanently clears local files, notes, bookmarks, notifications, and settings. This cannot be undone.', null, resetOS, 'Reset OS'); return; }
    if (action === 'empty-recycle') { if (state.recycle.length) showModal('Empty Recycle Bin?', 'These deleted items will be permanently removed.', null, () => { state.recycle = []; persist(); rerenderApp('recycle'); notify('Recycle Bin emptied', 'Deleted files have been removed.', '🗑️'); }, 'Empty'); return; }
  }
  function saveNote() {
    const editor = $('.note-editor', getAppWindow('notes')); if (!editor) return;
    if (!activeNoteId) { const file = newFile('text', `Note ${formatDate(new Date())}.txt`, 'Documents'); activeNoteId = file.id; }
    const file = state.files.find(item => item.id === activeNoteId); if (!file) return;
    file.content = editor.value; file.modified = Date.now(); delete state.drafts[file.id]; newNoteDraft = false; persist(); rerenderApp('notes'); notify('Note saved', file.name, '📝');
  }
  function navigateBrowser(win, address) {
    if (!win) return; const browser = win._browser;
    if (browser) browser.navigate(address);
    else { bindBrowser(win); win._browser?.navigate(address); }
  }
  function handleInput(event) {
    const target = event.target;
    if (target.id === 'volumeSlider') {
      state.settings.volume = Number(target.value);
      persist();
      updateVolumeControl();
      return;
    }
    if (target.classList.contains('global-search')) renderSearchResults(target.value);
    if (target.classList.contains('start-search')) {
      const q = target.value.toLowerCase(); $$('.start-app', $('#startMenu')).forEach(item => { item.hidden = !item.textContent.toLowerCase().includes(q); });
      if (q) { openSearch(q); target.value = q; }
    }
    if (target.classList.contains('file-search')) { fileQuery = target.value; const win = target.closest('.window'); const list = $('[data-file-list]', win); const files = visibleFiles(); list.innerHTML = files.length ? files.map(file => `<button class="file-card" data-file-id="${escapeHTML(file.id)}"><span class="file-glyph">${iconForFile(file)}</span><strong>${escapeHTML(file.name)}</strong><small>${file.type === 'folder' ? 'Folder' : formatDate(new Date(file.modified))}</small></button>`).join('') : '<div class="empty-state">No matching files.</div>'; return; }
    if (target.classList.contains('note-editor')) { saveDraft(); const text = target.value; const words = text.trim() ? text.trim().split(/\s+/).length : 0; $('.note-count', target.closest('.editor-shell')).textContent = `${text.length} characters · ${words} words`; }
  }
  function handleChange(event) {
    const target = event.target;
    if (target.matches('[data-wallpaper-upload]')) {
      const file = target.files?.[0];
      target.value = '';
      if (file) setCustomWallpaper(file);
      return;
    }
    if (target.id === 'volumeSlider') {
      $('#volumeStatus').textContent = state.settings.volume === 0 ? 'Volume is muted.' : playSound() ? 'Test sound played.' : 'Audio is unavailable in this browser.';
      return;
    }
    if (target.matches('[data-setting]')) {
      const key = target.dataset.setting; state.settings[key] = target.type === 'checkbox' ? target.checked : target.value; persist(); applySettings(); rerenderApp('settings');
      const label = ({ language: 'Language', theme: 'Color mode', accent: 'Accent color', taskbarPosition: 'Taskbar position', iconSize: 'Icon size', notifications: 'Notification preference', sounds: 'Notification sounds' })[key] || key;
      notify('Setting updated', `${label} changed.`, '⚙️');
    }
    if (target.classList.contains('file-sort')) { fileSort = target.value; rerenderApp('files'); }
    if (target.classList.contains('note-select')) { saveDraft(); activeNoteId = target.value || null; newNoteDraft = !target.value; rerenderApp('notes'); }
  }
  function handleSubmit(event) {
    const form = event.target;
    if (form.id === 'setupForm') {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('username') || '').trim();
      const pin = String(data.get('pin') || '');
      if (!name) { $('#setupName').focus(); return; }
      if (data.get('usePasscode') === 'yes' && !/^\d{4,12}$/.test(pin)) { $('#setupPin').focus(); return; }
      state.user.username = name;
      state.settings.language = String(data.get('language')) === 'sq' ? 'sq' : 'en';
      state.settings.pin = data.get('usePasscode') === 'yes' ? pin : '';
      needsSetup = false;
      persist();
      $('#setupScreen').classList.add('is-hidden'); $('#lockScreen').classList.add('is-hidden'); $('#desktopShell').classList.remove('is-hidden');
      renderStartMenu(); renderProfileBits(); renderNotificationDot(); applySettings();
      return;
    }
    if (form.classList.contains('terminal-form')) { event.preventDefault(); const input = $('input', form); const command = input.value; input.value = ''; runCommand(form.closest('.window'), command); }
    if (form.classList.contains('browser-address-form')) { event.preventDefault(); const address = $('.browser-address', form.closest('.window')).value.trim(); navigateBrowser(form.closest('.window'), address); }
    if (form.classList.contains('profile-form')) {
      event.preventDefault(); const data = new FormData(form); state.user.username = String(data.get('username')).trim() || 'Nova User'; state.user.computerName = String(data.get('computerName')).trim().replace(/\s+/g, '-').toUpperCase() || 'NOVA-DESKTOP'; state.user.picture = String(data.get('picture')).trim(); persist(); renderProfileBits(); renderStartMenu(); rerenderApp('profile'); notify('Profile updated', `Welcome, ${state.user.username}.`, '👤');
    }
    if (form.classList.contains('modal-box')) { /* Modal owns its own submit handler. */ }
  }
  function handleKeydown(event) {
    const key = event.key.toLowerCase();
    if (event.ctrlKey && key === 'k') { event.preventDefault(); openSearch(); return; }
    if (event.ctrlKey && event.altKey && key === 't') { event.preventDefault(); openApp('terminal'); return; }
    if (event.ctrlKey && event.shiftKey && key === 'e') { event.preventDefault(); openApp('files'); return; }
    if (event.ctrlKey && key === 'n') { event.preventDefault(); openApp('notes'); activeNoteId = null; newNoteDraft = true; rerenderApp('notes'); return; }
    if (event.key === 'Meta' || event.key === 'OS') { togglePanel('startMenu', renderStartMenu); return; }
    if (event.altKey && event.key === 'Tab') { event.preventDefault(); const list = windows(); if (!list.length) return; const active = list.findIndex(win => win.classList.contains('active-window')); focusWindow(list[(active + 1) % list.length]); return; }
    if (event.key === 'Escape') { closePanels(); $('#modalLayer').innerHTML = ''; $('#matrixLayer').classList.add('is-hidden'); cancelAnimationFrame(matrixAnimation); return; }
    if (event.key === 'Enter' && document.activeElement === $('#pinInput')) { unlockOS(event); }
    if (event.target.matches('.terminal-form input') && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault();
      if (event.key === 'ArrowUp') terminalHistoryIndex = Math.min(terminalHistory.length - 1, terminalHistoryIndex + 1);
      else terminalHistoryIndex = Math.max(-1, terminalHistoryIndex - 1);
      event.target.value = terminalHistoryIndex < 0 ? '' : terminalHistory[terminalHistoryIndex];
      return;
    }
    if (getAppWindow('calculator')?.classList.contains('active-window') && !event.ctrlKey) {
      const map = { Enter: '=', Backspace: '⌫', Escape: 'AC', '*': '×', '/': '÷', '-': '−', '+': '+', '.': '.', '%': '%', '=': '=' };
      const mapped = map[event.key] || (/^\d$/.test(event.key) ? event.key : null);
      if (mapped) { event.preventDefault(); calcPress(mapped, getAppWindow('calculator')); }
    }
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    window._konami ||= []; window._konami.push(event.key); window._konami = window._konami.slice(-konami.length);
    if (konami.every((item, index) => window._konami[index]?.toLowerCase() === item.toLowerCase())) { toast('Secret mode unlocked', 'A tiny salute to the classics.', '✦'); document.body.classList.toggle('secret-mode'); }
  }

  init();
})();
