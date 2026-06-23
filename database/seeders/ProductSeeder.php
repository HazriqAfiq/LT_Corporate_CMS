<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'LamanHR',
                'name_en' => 'LamanHR',
                'slug' => 'lamanhr',
                'description' => 'Sistem pengurusan sumber manusia yang lengkap dan moden untuk organisasi anda.',
                'description_en' => 'A complete and modern human resource management system for your organization.',
                'content' => '<p>LamanHR adalah platform pengurusan sumber manusia generasi terkini yang direka khas untuk memenuhi keperluan kompleks organisasi moden di Malaysia. Dibina di atas seni bina berasaskan awan yang selamat dan berskala, LamanHR menyatukan semua fungsi HR kritikal ke dalam satu platform bersepadu — menghapuskan keperluan untuk berbilang sistem berasingan dan hamparan data manual yang memakan masa dan terdedah kepada kesilapan.</p><p>Modul-modul utama LamanHR merangkumi pengurusan data pekerja yang komprehensif termasuk maklumat peribadi, sejarah pekerjaan, kelayakan akademik, sijil profesional, dan rekod latihan. Sistem ini menyokong struktur organisasi berbilang peringkat dengan hierarki pelaporan yang fleksibel, menjadikannya sesuai untuk organisasi daripada syarikat kecil sehinggalah kepada konglomerat besar dengan ribuan kakitangan. Ciri carian dan penapisan lanjutan membolehkan pasukan HR mencari maklumat pekerja dengan pantas dan tepat.</p><p>Dari segi pengurusan cuti, LamanHR mengautomasikan keseluruhan kitaran hayat permohonan cuti — daripada penyerahan permohonan oleh pekerja, penghalaan automatik kepada penyelia yang betul berdasarkan hierarki organisasi, kelulusan atau penolakan dengan komen, sehinggalah kepada kemas kini baki cuti secara automatik. Sistem ini menyokong pelbagai jenis cuti termasuk cuti tahunan, cuti sakit, cuti kecemasan, cuti bersalin, cuti tanpa gaji, dan cuti khas mengikut dasar syarikat masing-masing. Kalendar cuti berpusat membolehkan pengurus melihat kehadiran pasukan pada bila-bila masa.</p><p>Sistem pengurusan gaji LamanHR memudahkan proses pengiraan gaji yang kompleks termasuk potongan KWSP/EPF, PERKESO/SOCSO, PCB/cukai pendapatan, caruman tambahan, overtime, elaun, bonus, dan tuntutan perbelanjaan. Integrasi dengan modul kehadiran memastikan data kehadiran digunakan secara automatik dalam pengiraan gaji. Laporan slip gaji boleh dijana secara automatik dan diedarkan kepada pekerja melalui portal layan diri, mengurangkan beban pentadbiran pasukan HR dengan ketara.</p><p>Modul penilaian prestasi menyokong pelbagai metodologi penilaian termasuk KPI, OKR, penilaian 360 darjah, dan penilaian berasaskan kompetensi. Kitaran penilaian boleh dikonfigurasikan mengikut keperluan organisasi — suku tahunan, separuh tahunan, atau tahunan. Carta radar prestasi dan laporan analitik membantu pengurus dan HR mengenal pasti pekerja berprestasi tinggi yang layak untuk kenaikan pangkat, serta pekerja yang memerlukan latihan tambahan. Semua data disimpan dengan selamat dan mematuhi Akta Perlindungan Data Peribadi 2010 (PDPA).</p>',
                'content_en' => '<p>LamanHR is a next-generation human resource management platform specifically designed to meet the complex needs of modern organizations in Malaysia. Built on secure and scalable cloud-based architecture, LamanHR unifies all critical HR functions into a single integrated platform — eliminating the need for multiple disparate systems and error-prone manual spreadsheets.</p><p>The core modules of LamanHR include comprehensive employee data management covering personal information, employment history, academic qualifications, professional certifications, and training records. The system supports multi-level organizational structures with flexible reporting hierarchies, making it suitable for organizations ranging from small companies to large conglomerates with thousands of staff. Advanced search and filtering capabilities enable HR teams to locate employee information quickly and accurately.</p><p>For leave management, LamanHR automates the entire leave application lifecycle — from employee submission, automatic routing to the correct supervisor based on organizational hierarchy, approval or rejection with comments, to automatic leave balance updates. The system supports various leave types including annual leave, sick leave, emergency leave, maternity leave, unpaid leave, and special leave according to each company policy. A centralized leave calendar allows managers to view team attendance at any time.</p><p>The LamanHR payroll management system simplifies complex salary calculations including KWSP/EPF deductions, PERKESO/SOCSO, PCB/income tax, additional contributions, overtime, allowances, bonuses, and expense claims. Integration with the attendance module ensures attendance data is automatically used in payroll calculations. Payslip reports can be automatically generated and distributed to employees via the self-service portal, significantly reducing the administrative burden on HR teams.</p><p>The performance appraisal module supports multiple evaluation methodologies including KPI, OKR, 360-degree feedback, and competency-based assessments. Review cycles can be configured according to organizational needs — quarterly, semi-annually, or annually. Performance radar charts and analytical reports help managers and HR identify high-performing employees eligible for promotion, as well as employees requiring additional training. All data is stored securely and complies with the Personal Data Protection Act 2010 (PDPA).</p>',
                'icon' => null,
                'category' => 'Pengurusan',
                'features' => ['Pengurusan Pekerja', 'Sistem Cuti', 'Pengurusan Gaji', 'Laporan HR', 'Kehadiran Digital'],
                'features_en' => ['Employee Management', 'Leave System', 'Payroll Management', 'HR Reports', 'Digital Attendance'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'name' => 'LamanSupport',
                'name_en' => 'LamanSupport',
                'slug' => 'lamansupport',
                'description' => 'Sistem sokongan pelanggan dan tiket yang efisien untuk perniagaan anda.',
                'description_en' => 'An efficient customer support and ticketing system for your business.',
                'content' => '<p>LamanSupport adalah platform pengurusan perkhidmatan pelanggan yang komprehensif, direka untuk membantu organisasi menyampaikan sokongan teknikal dan khidmat pelanggan yang cemerlang. Sistem tiket berpusat kami memastikan setiap pertanyaan, aduan, atau permintaan pelanggan direkodkan, dijejak, dan diselesaikan secara sistematik — tiada lagi emel yang hilang atau aduan yang terlepas pandang.</p><p>Sistem tiket LamanSupport menyokong pelbagai saluran kemasukan termasuk emel, borang web, live chat, WhatsApp, dan integrasi media sosial. Setiap tiket yang diterima secara automatik dikategorikan, diutamakan, dan diagihkan kepada ejen sokongan yang sesuai berdasarkan kemahiran, beban kerja, dan ketersediaan. Peraturan automasi pintar (smart routing rules) memastikan tiket kecemasan sampai kepada ejen yang tepat dalam masa beberapa saat, manakala tiket rutin dijadualkan dengan efisien.</p><p>Modul pangkalan pengetahuan (knowledge base) membolehkan organisasi membina perpustakaan artikel bantuan, panduan langkah demi langkah, dan soalan lazim (FAQ) yang boleh diakses oleh pelanggan secara layan diri. Ini bukan sahaja memperkasakan pelanggan untuk menyelesaikan masalah mudah sendiri, tetapi juga mengurangkan beban tiket kepada pasukan sokongan. Artikel pengetahuan boleh dikategorikan, ditag, dan dioptimumkan untuk enjin carian bagi memudahkan pencarian.</p><p>Ciri live chat masa nyata membolehkan ejen sokongan berinteraksi dengan pelanggan secara langsung di laman web atau aplikasi anda. Sejarah perbualan disimpan dan dikaitkan dengan profil pelanggan, memberikan konteks penuh kepada ejen tentang interaksi terdahulu. Pemindahan perbualan (chat transfer) yang lancar membolehkan isu kompleks dinaik taraf kepada ejen kanan tanpa pelanggan perlu mengulangi masalah mereka.</p><p>Laporan dan analitik LamanSupport memberikan pandangan mendalam tentang prestasi pasukan sokongan anda. Papan pemuka masa nyata memaparkan metrik utama seperti masa respons purata, masa penyelesaian, skor kepuasan pelanggan (CSAT), dan kadar penyelesaian pada sentuhan pertama (FCR). Laporan trend membantu mengenal pasti isu berulang yang memerlukan perhatian dan peluang untuk penambahbaikan proses secara berterusan.</p>',
                'content_en' => '<p>LamanSupport is a comprehensive customer service management platform designed to help organizations deliver outstanding technical support and customer service. Our centralized ticketing system ensures every customer inquiry, complaint, or request is recorded, tracked, and resolved systematically — no more lost emails or overlooked complaints.</p><p>The LamanSupport ticketing system supports multiple entry channels including email, web forms, live chat, WhatsApp, and social media integrations. Each received ticket is automatically categorized, prioritized, and distributed to the appropriate support agent based on skills, workload, and availability. Smart automation routing rules ensure urgent tickets reach the right agent within seconds, while routine tickets are scheduled efficiently.</p><p>The knowledge base module enables organizations to build a library of help articles, step-by-step guides, and frequently asked questions (FAQ) accessible to customers on a self-service basis. This not only empowers customers to resolve simple issues themselves but also reduces the ticket burden on support teams. Knowledge articles can be categorized, tagged, and search engine optimized for easy discovery.</p><p>The real-time live chat feature allows support agents to interact with customers directly on your website or application. Chat history is saved and linked to customer profiles, providing agents with full context about previous interactions. Seamless chat transfer enables complex issues to be escalated to senior agents without customers having to repeat their problems.</p><p>LamanSupport reports and analytics provide deep insights into your support team performance. Real-time dashboards display key metrics such as average response time, resolution time, customer satisfaction scores (CSAT), and first contact resolution rates (FCR). Trend reports help identify recurring issues that need attention and opportunities for continuous process improvement.</p>',
                'icon' => null,
                'category' => 'Sokongan',
                'features' => ['Sistem Tiket', 'Live Chat', 'Pangkalan Pengetahuan', 'Laporan SLA', 'Integrasi Email'],
                'features_en' => ['Ticketing System', 'Live Chat', 'Knowledge Base', 'SLA Reports', 'Email Integration'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'name' => 'LamanAI',
                'name_en' => 'LamanAI',
                'slug' => 'lamanai',
                'description' => 'Penyelesaian kecerdasan buatan untuk automasi dan analitik perniagaan.',
                'description_en' => 'Artificial intelligence solutions for business automation and analytics.',
                'content' => '<p>LamanAI adalah platform kecerdasan buatan komprehensif yang membawa kuasa AI kepada organisasi dari sebarang saiz. Dibina menggunakan teknologi model bahasa besar (LLM) terkini termasuk integrasi GPT dan model sumber terbuka, LamanAI membolehkan perniagaan mengautomasikan interaksi pelanggan, menganalisis data besar, dan menjana cerapan perniagaan yang sebelum ini mustahil diperoleh secara manual.</p><p>Modul chatbot AI LamanAI menyokong pemprosesan bahasa tabii dalam Bahasa Melayu dan Inggeris, memahaminya dengan konteks yang mendalam. Chatbot boleh dilatih menggunakan dokumen korporat, pangkalan pengetahuan, dan sejarah perbualan lampau untuk memberikan respons yang tepat, relevan, dan berperikemanusiaan. Ia boleh disepadukan ke laman web, WhatsApp, Telegram, dan aplikasi mudah alih — memastikan pelanggan anda mendapat bantuan segera pada bila-bila masa, 24 jam sehari tanpa memerlukan ejen manusia.</p><p>Dalam bidang analitik ramalan, LamanAI menggunakan algoritma pembelajaran mesin untuk menganalisis data sejarah perniagaan dan meramalkan trend masa hadapan. Sama ada meramalkan permintaan inventori, mengenal pasti pelanggan yang berisiko beralih, atau meramalkan hasil jualan suku akan datang — model AI kami memberikan ketepatan yang mengagumkan. Papan pemuka visual mempersembahkan ramalan dalam bentuk carta dan graf interaktif yang mudah difahami oleh pihak pengurusan.</p><p>LamanAI juga menyediakan modul pengesanan anomali yang memantau data perniagaan secara berterusan dan menandakan sebarang penyelewengan yang mencurigakan — sama ada transaksi kewangan yang luar biasa, lonjakan trafik yang tidak dijangka, atau perubahan pola tingkah laku pengguna. Amaran automatik dihantar kepada pasukan yang berkaitan melalui emel, SMS, atau notifikasi aplikasi, membolehkan tindakan proaktif diambil sebelum masalah kecil berkembang menjadi krisis besar.</p>',
                'content_en' => '<p>LamanAI is a comprehensive artificial intelligence platform that brings the power of AI to organizations of any size. Built using the latest large language model (LLM) technologies including GPT integrations and open-source models, LamanAI enables businesses to automate customer interactions, analyze big data, and generate business insights that were previously impossible to obtain manually.</p><p>The LamanAI chatbot module supports natural language processing in both Malay and English, understanding them with deep context. Chatbots can be trained using corporate documents, knowledge bases, and historical conversation logs to provide accurate, relevant, and human-like responses. It can be integrated into websites, WhatsApp, Telegram, and mobile applications — ensuring your customers receive immediate assistance at any time, 24 hours a day, without requiring human agents.</p><p>In predictive analytics, LamanAI employs machine learning algorithms to analyze historical business data and forecast future trends. Whether predicting inventory demand, identifying customers at risk of churning, or forecasting next quarter revenue — our AI models deliver impressive accuracy. Visual dashboards present forecasts through interactive charts and graphs that are easily digestible by management.</p><p>LamanAI also features an anomaly detection module that continuously monitors business data and flags any suspicious deviations — whether unusual financial transactions, unexpected traffic spikes, or shifts in user behavior patterns. Automated alerts are sent to relevant teams via email, SMS, or app notifications, enabling proactive action before small issues escalate into major crises.</p>',
                'icon' => null,
                'category' => 'AI',
                'features' => ['Chatbot AI', 'Analitik Ramalan', 'Automasi Proses', 'NLP Bahasa Melayu', 'Dashboard Pintar'],
                'features_en' => ['AI Chatbot', 'Predictive Analytics', 'Process Automation', 'Malay NLP', 'Smart Dashboard'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'name' => 'LamanTeam',
                'name_en' => 'LamanTeam',
                'slug' => 'lamanteam',
                'description' => 'Platform kolaborasi pasukan untuk pengurusan projek dan komunikasi dalaman.',
                'description_en' => 'Team collaboration platform for project management and internal communication.',
                'content' => '<p>LamanTeam adalah platform kolaborasi digital yang menyatukan pengurusan projek, komunikasi pasukan, dan perkongsian dokumen ke dalam satu ruang kerja bersatu. Direka untuk era kerja hibrid dan jarak jauh, LamanTeam memastikan setiap ahli pasukan kekal selari, produktif, dan terhubung tanpa mengira lokasi fizikal mereka — sama ada di pejabat, di rumah, atau di lapangan.</p><p>Modul pengurusan projek menyokong metodologi tangkas (Agile) dan air terjun (Waterfall), memberikan fleksibiliti kepada pasukan untuk memilih pendekatan yang paling sesuai dengan projek masing-masing. Papan Kanban, carta Gantt, dan senarai tugasan membolehkan pengurus projek merancang, menjejak, dan menyampaikan projek mengikut jadual. Setiap tugasan boleh diberikan kepada ahli pasukan tertentu, dilengkapi dengan tarikh akhir, keutamaan, kebergantungan, dan penanda aras pencapaian (milestones).</p><p>Komunikasi dalam LamanTeam berpusat di sekitar saluran (channels) yang boleh diatur mengikut projek, jabatan, atau topik. Ini menghapuskan kekeliruan emel berantai dan mesej yang berselerak di pelbagai platform. Perbualan berbenang (threaded conversations) memastikan perbincangan kekal teratur dan mudah dirujuk semula. Ciri perkongsian skrin dan panggilan video bersepadu membolehkan perbincangan secara langsung tanpa perlu beralih ke aplikasi lain.</p><p>Modul perkongsian dokumen menyediakan storan awan berpusat dengan kawalan versi. Setiap dokumen yang dimuat naik atau dikemas kini disimpan dengan sejarah versi lengkap, membolehkan pasukan kembali ke versi terdahulu pada bila-bila masa. Kawalan akses berasaskan peranan (role-based access control) memastikan dokumen sulit hanya boleh diakses oleh kakitangan yang diberi kuasa. Integrasi dengan alat produktiviti popular seperti Google Workspace dan Microsoft 365 membolehkan penyuntingan kolaboratif secara masa nyata.</p>',
                'content_en' => '<p>LamanTeam is a digital collaboration platform that unifies project management, team communication, and document sharing into a single unified workspace. Designed for the era of hybrid and remote work, LamanTeam ensures every team member stays aligned, productive, and connected regardless of their physical location — whether in the office, at home, or in the field.</p><p>The project management module supports both Agile and Waterfall methodologies, providing teams the flexibility to choose the approach most suitable for their respective projects. Kanban boards, Gantt charts, and task lists enable project managers to plan, track, and deliver projects on schedule. Each task can be assigned to a specific team member, complete with deadlines, priorities, dependencies, and milestones.</p><p>Communication in LamanTeam is centered around channels that can be organized by project, department, or topic. This eliminates the confusion of chain emails and messages scattered across multiple platforms. Threaded conversations keep discussions organized and easily referable. Built-in screen sharing and video calling enable live discussions without switching to another application.</p><p>The document sharing module provides centralized cloud storage with version control. Every uploaded or updated document is saved with a complete version history, allowing teams to revert to previous versions at any time. Role-based access control ensures confidential documents are only accessible to authorized personnel. Integration with popular productivity tools such as Google Workspace and Microsoft 365 enables real-time collaborative editing.</p>',
                'icon' => null,
                'category' => 'Kolaborasi',
                'features' => ['Pengurusan Projek', 'Kanban Board', 'Chat Pasukan', 'Perkongsian Fail', 'Penjejakan Masa'],
                'features_en' => ['Project Management', 'Kanban Board', 'Team Chat', 'File Sharing', 'Time Tracking'],
                'is_active' => true,
                'is_featured' => false,
                'order' => 4,
            ],
            [
                'name' => 'LamanCRM',
                'name_en' => 'LamanCRM',
                'slug' => 'lamancrm',
                'description' => 'Sistem pengurusan hubungan pelanggan untuk meningkatkan jualan dan khidmat pelanggan.',
                'description_en' => 'Customer relationship management system to boost sales and customer service.',
                'content' => '<p>LamanCRM adalah sistem pengurusan hubungan pelanggan yang berkuasa, direka untuk membantu pasukan jualan dan pemasaran menguruskan interaksi pelanggan dengan lebih efektif. Dengan visualisasi pipeline jualan yang intuitif, automasi pemasaran pintar, dan integrasi WhatsApp terus, LamanCRM memastikan tiada peluang jualan yang terlepas dan setiap pelanggan mendapat perhatian yang sewajarnya pada masa yang tepat.</p><p>Modul pipeline jualan mempersembahkan perjalanan setiap prospek daripada kenalan awal sehinggalah kepada penutupan tawaran dalam bentuk papan Kanban yang mudah difahami. Setiap peringkat pipeline boleh disesuaikan mengikut proses jualan unik organisasi anda. Peringatan automatik dan tugasan susulan memastikan wakil jualan tidak pernah terlupa untuk menghubungi prospek pada masa yang kritikal. Ciri seret-dan-lepas (drag-and-drop) memudahkan pemindahan prospek antara peringkat pipeline apabila mereka maju ke fasa seterusnya.</p><p>Pengurusan leads yang komprehensif membolehkan pasukan menangkap leads daripada pelbagai sumber — borang laman web, kempen iklan, pameran perdagangan, dan rujukan — dan menyimpannya dalam pangkalan data berpusat. Setiap lead diperkaya secara automatik dengan data tambahan daripada sumber awam untuk memberikan profil yang lebih lengkap. Sistem pemarkahan leads (lead scoring) automatik membantu pasukan jualan memberi tumpuan kepada prospek yang paling berkemungkinan untuk menukar.</p><p>Integrasi WhatsApp yang mendalam merupakan salah satu ciri unggul LamanCRM. Wakil jualan boleh menghantar dan menerima mesej WhatsApp terus dari dalam platform CRM, dengan semua perbualan direkodkan secara automatik dalam profil pelanggan. Templat mesej, siaran broadcast, dan chatbot WhatsApp automatik mempercepatkan komunikasi pelanggan secara dramatik. Ini amat relevan dalam konteks Malaysia di mana WhatsApp adalah saluran komunikasi perniagaan yang dominan.</p>',
                'content_en' => '<p>LamanCRM is a powerful customer relationship management system designed to help sales and marketing teams manage customer interactions more effectively. With intuitive sales pipeline visualization, smart marketing automation, and direct WhatsApp integration, LamanCRM ensures no sales opportunity is missed and every customer receives the right attention at the right time.</p><p>The sales pipeline module visualizes each prospect journey from initial contact to deal closure in an easily digestible Kanban board format. Each pipeline stage can be customized according to your organization unique sales process. Automated reminders and follow-up tasks ensure sales representatives never forget to contact prospects at critical moments. Drag-and-drop functionality makes moving prospects between pipeline stages effortless as they advance to the next phase.</p><p>Comprehensive lead management enables teams to capture leads from multiple sources — website forms, ad campaigns, trade exhibitions, and referrals — and store them in a centralized database. Each lead is automatically enriched with additional data from public sources to provide a more complete profile. Automated lead scoring helps sales teams focus on prospects most likely to convert.</p><p>Deep WhatsApp integration is one of LamanCRM standout features. Sales representatives can send and receive WhatsApp messages directly from within the CRM platform, with all conversations automatically recorded in the customer profile. Message templates, broadcast messaging, and automated WhatsApp chatbots dramatically speed up customer communication. This is highly relevant in the Malaysian context where WhatsApp is the dominant business communication channel.</p>',
                'icon' => null,
                'category' => 'Jualan',
                'features' => ['Pipeline Jualan', 'Pengurusan Leads', 'Automasi Pemasaran', 'Laporan Jualan', 'Integrasi WhatsApp'],
                'features_en' => ['Sales Pipeline', 'Lead Management', 'Marketing Automation', 'Sales Reports', 'WhatsApp Integration'],
                'is_active' => true,
                'is_featured' => false,
                'order' => 5,
            ],
            [
                'name' => 'LamanEvent',
                'name_en' => 'LamanEvent',
                'slug' => 'lamanevent',
                'description' => 'Platform pengurusan acara dan pendaftaran peserta secara digital.',
                'description_en' => 'Digital event management and participant registration platform.',
                'content' => '<p>LamanEvent adalah platform pengurusan acara digital yang komprehensif, membolehkan penganjur merancang, mengurus, dan melaksanakan acara dari sebarang skala — daripada webinar kecil sehinggalah kepada persidangan antarabangsa dengan ribuan peserta. Platform ini mengautomasikan setiap aspek pengurusan acara, dari pendaftaran hingga penilaian pasca-acara, mengurangkan beban pentadbiran secara drastik.</p><p>Sistem pendaftaran peserta menyokong pelbagai jenis tiket — percuma, berbayar, harga awal (early bird), berkumpulan, dan kod promosi. Pembayaran dalam talian diuruskan dengan selamat melalui integrasi gerbang pembayaran seperti Stripe, PayPal, dan FPX. Setiap peserta menerima e-tiket unik dengan kod QR yang boleh diimbas untuk kemasukan pantas di hari acara. Borang pendaftaran yang boleh disesuaikan membolehkan penganjur mengumpul maklumat tambahan seperti pilihan makanan, saiz baju, atau keperluan khas.</p><p>Modul pengurusan tempat (venue) dan logistik membantu penganjur merancang susun atur dewan, penginapan, dan pengangkutan. Pelan lantai interaktif menunjukkan kedudukan gerai pameran, meja pendaftaran, dan kawasan rehat. Sistem ini mengintegrasikan data pendaftaran untuk meramalkan kehadiran dan mencadangkan peruntukan sumber yang optimum — mengelakkan pembaziran atau kekurangan.</p><p>Ciri e-sijil automatik menjana dan mengedarkan sijil penyertaan digital sejurus selepas acara tamat. Setiap sijil mengandungi kod QR unik untuk pengesahan ketulenan. Peserta juga boleh mengakses bahan pembentangan, rakaman video, dan sumber tambahan melalui portal pasca-acara yang kekal aktif selama tempoh yang ditentukan oleh penganjur. Laporan pasca-acara yang komprehensif memberikan analitik terperinci tentang demografi peserta, kadar kehadiran, maklum balas, dan pulangan pelaburan (ROI).</p>',
                'content_en' => '<p>LamanEvent is a comprehensive digital event management platform that enables organizers to plan, manage, and execute events of any scale — from small webinars to international conferences with thousands of participants. The platform automates every aspect of event management, from registration to post-event evaluation, drastically reducing administrative burden.</p><p>The participant registration system supports various ticket types — free, paid, early bird, group, and promo codes. Online payments are securely managed through payment gateway integrations such as Stripe, PayPal, and FPX. Each participant receives a unique e-ticket with a QR code that can be scanned for quick entry on event day. Customizable registration forms allow organizers to collect additional information such as meal preferences, shirt sizes, or special requirements.</p><p>The venue and logistics module helps organizers plan hall layouts, accommodation, and transportation. Interactive floor plans show booth positions, registration desks, and rest areas. The system integrates registration data to forecast attendance and suggest optimal resource allocation — avoiding wastage or shortages.</p><p>The automatic e-certificate feature generates and distributes digital attendance certificates immediately after the event concludes. Each certificate contains a unique QR code for authenticity verification. Participants can also access presentation materials, video recordings, and additional resources through the post-event portal that remains active for a period determined by the organizer. Comprehensive post-event reports provide detailed analytics on participant demographics, attendance rates, feedback, and return on investment (ROI).</p>',
                'icon' => null,
                'category' => 'Acara',
                'features' => ['Pendaftaran Online', 'Pengurusan Tempat', 'E-Sijil', 'QR Check-in', 'Laporan Acara'],
                'features_en' => ['Online Registration', 'Venue Management', 'E-Certificate', 'QR Check-in', 'Event Reports'],
                'is_active' => true,
                'is_featured' => false,
                'order' => 6,
            ],
            [
                'name' => 'LamanRisk',
                'name_en' => 'LamanRisk',
                'slug' => 'lamanrisk',
                'description' => 'Sistem pengurusan risiko dan pematuhan untuk organisasi korporat.',
                'description_en' => 'Risk management and compliance system for corporate organizations.',
                'content' => '<p>LamanRisk adalah sistem pengurusan risiko dan pematuhan perusahaan yang dibina khusus untuk membantu organisasi menavigasi landskap kawal selia yang semakin kompleks. Daripada penilaian risiko strategik sehinggalah kepada pemantauan pematuhan harian, LamanRisk menyediakan rangka kerja bersatu untuk mengurus tadbir urus korporat, risiko, dan pematuhan (Governance, Risk, and Compliance — GRC) dengan lebih cekap dan telus.</p><p>Modul penilaian risiko membolehkan organisasi mengenal pasti, menilai, dan mengutamakan risiko merentas semua peringkat — strategik, operasi, kewangan, dan pematuhan. Setiap risiko direkodkan dengan tahap keterukan, kemungkinan berlaku, dan kesan potensi, menghasilkan peta haba risiko (risk heat map) yang memberikan pandangan menyeluruh tentang profil risiko organisasi pada bila-bila masa. Pelan mitigasi risiko dibangunkan secara kolaboratif dengan pemilik risiko yang ditetapkan, dengan tarikh akhir dan penanda aras yang jelas untuk memastikan akauntabiliti.</p><p>Dari segi pematuhan, LamanRisk menyokong pemetaan kepada pelbagai rangka kerja dan piawaian antarabangsa termasuk ISO 31000, ISO 27001, PCI DSS, dan Akta Perlindungan Data Peribadi 2010 (PDPA). Sistem ini menjejak keperluan kawal selia yang berkaitan dengan industri dan geografi operasi anda, menjana senarai semak pematuhan automatik, dan memberi amaran awal tentang tarikh akhir pematuhan yang hampir. Jejak audit (audit trail) yang tidak boleh diubah merekodkan setiap tindakan dan perubahan dalam sistem, menyediakan bukti yang kukuh untuk audit dalaman dan luaran.</p><p>Papan pemuka risiko dan pematuhan mempersembahkan metrik utama secara visual dan masa nyata kepada pihak pengurusan dan lembaga pengarah. Indikator risiko utama (KRI), status pematuhan, dan insiden terkini dipaparkan dalam format yang mudah difahami, memudahkan pembuatan keputusan strategik. Laporan boleh dijana secara automatik mengikut jadual yang ditetapkan — harian, mingguan, bulanan, atau suku tahunan — dan diedarkan kepada pihak berkepentingan melalui emel.</p>',
                'content_en' => '<p>LamanRisk is an enterprise risk management and compliance system built specifically to help organizations navigate an increasingly complex regulatory landscape. From strategic risk assessment to daily compliance monitoring, LamanRisk provides a unified framework for managing Governance, Risk, and Compliance (GRC) more efficiently and transparently.</p><p>The risk assessment module enables organizations to identify, evaluate, and prioritize risks across all levels — strategic, operational, financial, and compliance. Each risk is recorded with severity level, likelihood of occurrence, and potential impact, generating a risk heat map that provides a comprehensive view of the organization risk profile at any time. Risk mitigation plans are developed collaboratively with designated risk owners, complete with clear deadlines and milestones to ensure accountability.</p><p>For compliance, LamanRisk supports mapping to multiple international frameworks and standards including ISO 31000, ISO 27001, PCI DSS, and the Personal Data Protection Act 2010 (PDPA). The system tracks regulatory requirements relevant to your industry and operating geography, generates automated compliance checklists, and provides early warnings about upcoming compliance deadlines. An immutable audit trail records every action and change in the system, providing robust evidence for internal and external audits.</p><p>The risk and compliance dashboard presents key metrics visually and in real-time to management and board members. Key risk indicators (KRI), compliance status, and recent incidents are displayed in easily digestible formats, facilitating strategic decision-making. Reports can be generated automatically on a preset schedule — daily, weekly, monthly, or quarterly — and distributed to stakeholders via email.</p>',
                'icon' => null,
                'category' => 'Pematuhan',
                'features' => ['Penilaian Risiko', 'Pematuhan Regulasi', 'Audit Trail', 'Dashboard Risiko', 'Laporan Pematuhan'],
                'features_en' => ['Risk Assessment', 'Regulatory Compliance', 'Audit Trail', 'Risk Dashboard', 'Compliance Reports'],
                'is_active' => true,
                'is_featured' => false,
                'order' => 7,
            ],
        ];

        foreach ($products as $product) {
            $imageMapping = [
                'lamanhr' => 'hr_dashboard.webp',
                'lamansupport' => 'support_crm.webp',
                'lamanai' => 'ai_analytics.webp',
                'lamanteam' => 'hr_dashboard.webp',
                'lamancrm' => 'support_crm.webp',
                'lamanevent' => 'ai_analytics.webp',
                'lamanrisk' => 'hr_dashboard.webp',
            ];

            $slug = $product['slug'];
            $imageName = $imageMapping[$slug] ?? null;
            $mediaId = null;

            if ($imageName) {
                $mediaPath = 'uploads/products/' . $imageName;
                $media = \App\Models\Media::firstOrCreate(
                    ['path' => $mediaPath],
                    [
                        'uuid' => (string) \Illuminate\Support\Str::uuid(),
                        'type' => 'image',
                        'extension' => 'webp',
                        'filename' => $imageName,
                        'original_filename' => $imageName,
                        'disk' => 'public',
                        'mime_type' => 'image/webp',
                        'size' => 102400,
                        'is_public' => true,
                        'title' => $product['name'] . ' Preview',
                        'alt_text' => $product['name'] . ' Preview Image',
                        'collection' => 'products',
                    ]
                );
                $mediaId = $media->id;
            }

            $productData = $product;
            if ($mediaId) {
                $productData['featured_media_id'] = $mediaId;
            }

            $existingProduct = Product::where('slug', $slug)->first();
            if ($existingProduct) {
                $existingProduct->update($productData);
            } else {
                Product::create($productData);
            }
        }
    }
}
