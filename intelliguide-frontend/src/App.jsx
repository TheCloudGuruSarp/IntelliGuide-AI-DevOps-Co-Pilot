import React, { useState, useEffect, useRef } from 'react';

// --- ICONS (SVG) ---
const BotIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg> );
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const SendIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> );
const CopyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const LoadingSpinner = () => ( <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> );
const TargetIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> );
const InfoIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0 text-blue-400 mr-3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> );

// --- DATA (Veri ve konfigürasyonlar) ---
const toolCategories = [ { name: "Container & Orkestrasyon", tools: [ { id: 'docker', name: 'Docker', description: 'Uygulamaları konteynerler ile geliştirin, dağıtın ve çalıştırın.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', params: [{ id: 'version', label: 'Docker Versiyonu', type: 'select', options: ['27.0.3', '26.1.4', '25.0.5', '24.0.7', '23.0.6'], defaultValue: '27.0.3' }] }, { id: 'kubernetes', name: 'Kubernetes', description: 'Konteynerize uygulamaların dağıtımı ve yönetimini otomatikleştirin.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', params: [ { id: 'version', label: 'Kubernetes Versiyonu', type: 'select', options: ['1.30.2', '1.29.6', '1.28.11', '1.27.15', '1.26.15'], defaultValue: '1.30.2' }, { id: 'master_count', label: 'Master Node Sayısı', type: 'number', min: 1, max: 5, defaultValue: 1 }, { id: 'worker_count', label: 'Worker Node Sayısı', type: 'number', min: 0, max: 10, defaultValue: 1 }, ]}, { id: 'rancher-rke2', name: 'Rancher / RKE2', description: 'Kurumsal Kubernetes yönetimi için komple bir platform.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rancher/rancher-original.svg', params: [ { id: 'version', label: 'Rancher Versiyonu', type: 'select', options: ['2.9.2', '2.8.5', '2.7.9', '2.6.14', '2.5.17'], defaultValue: '2.9.2' }, { id: 'master_count', label: 'Master Node Sayısı', type: 'number', min: 1, max: 5, defaultValue: 1 }, { id: 'worker_count', label: 'Worker Node Sayısı', type: 'number', min: 0, max: 10, defaultValue: 1 }, ]}, { id: 'helm', name: 'Helm', description: 'Kubernetes için paket yöneticisi.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/helm/helm-original.svg', params: [{ id: 'version', label: 'Helm Versiyonu', type: 'select', options: ['3.15.2', '3.14.4', '3.13.3', '3.12.3', '3.11.3'], defaultValue: '3.15.2' }] }, ] }, { name: "CI/CD", tools: [ { id: 'jenkins', name: 'Jenkins', description: 'Popüler, açık kaynaklı otomasyon sunucusu.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg', params: [ { id: 'version', label: 'Jenkins LTS Versiyonu', type: 'select', options: ['2.452.2', '2.440.3', '2.426.3', '2.414.3', '2.401.3'], defaultValue: '2.452.2' }, { id: 'domain_name', label: 'Jenkins Erişimi İçin Domain Adı', type: 'text', placeholder: 'jenkins.example.com' }, { id: 'admin_user', label: 'Admin Kullanıcı Adı (Opsiyonel)', type: 'text', placeholder: 'admin' } ]}, { id: 'gitlab-ci', name: 'GitLab', description: 'GitLab ile entegre, güçlü CI/CD çözümü.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg', params: [{ id: 'version', label: 'GitLab Versiyonu', type: 'select', options: ['17.2.1', '17.1.3', '17.0.5', '16.11.5', '16.10.7'], defaultValue: '17.2.1' }, {id: 'gitlab_runner_tags', label: 'Runner Etiketleri (virgülle ayırın)', type: 'text', placeholder: 'docker,prod'}] }, { id: 'github-actions', name: 'GitHub Actions', description: 'GitHub reponuzdan yazılım iş akışlarını otomatikleştirin.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg', params: [{ id: 'version', label: 'Runner Versiyonu', type: 'select', options: ['2.317.0', '2.316.1', '2.315.0', '2.314.1', '2.313.0'], defaultValue: '2.317.0' }, {id: 'runner_scope', label: 'Self-Hosted Runner Kapsamı (repo/org)', type: 'text', placeholder: 'my-org/my-repo'}] }, { id: 'argocd', name: 'Argo CD', description: 'Kubernetes için bildirimsel, GitOps sürekli dağıtım aracı.', logo: 'https://raw.githubusercontent.com/cncf/artwork/master/projects/argo/icon/color/argo-icon-color.svg', params: [ { id: 'version', label: 'Argo CD Versiyonu', type: 'select', options: ['v2.11.3', 'v2.10.11', 'v2.9.16', 'v2.8.21', 'v2.7.18'], defaultValue: 'v2.11.3' }, { id: 'kube_namespace', label: 'Kurulacak Kubernetes Namespace', type: 'text', placeholder: 'argocd', defaultValue: 'argocd' }, { id: 'install_cli', label: 'Argo CD CLI kurulsun mu?', type: 'select', options: ['Evet', 'Hayır'], defaultValue: 'Evet' } ]}, ] }, { name: "Altyapı Kodu (IaC)", tools: [ { id: 'terraform', name: 'Terraform', description: 'Altyapıyı güvenli ve verimli bir şekilde oluşturun, değiştirin.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg', params: [{ id: 'version', label: 'Terraform Versiyonu', type: 'select', options: ['1.8.4', '1.7.5', '1.6.6', '1.5.7', '1.4.6'], defaultValue: '1.8.4' }, {id: 'provider', label: 'Bulut Sağlayıcı', type: 'select', options: ['AWS', 'Azure', 'Google Cloud'], defaultValue: 'AWS'}] }, { id: 'ansible', name: 'Ansible', description: 'Uygulama dağıtımı ve konfigürasyon yönetimi için otomasyon.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg', params: [{ id: 'version', label: 'Ansible Versiyonu', type: 'select', options: ['10.1.0', '9.5.1', '8.7.0', '7.7.0', '6.7.0'], defaultValue: '10.1.0' }, {id: 'inventory_hosts', label: 'Hedef Hostlar (virgülle ayırın)', type: 'text', placeholder: 'server1.example.com, server2.example.com'}] }, { id: 'pulumi', name: 'Pulumi', description: 'Favori dilinizi kullanarak altyapı oluşturun ve dağıtın.', logo: 'https://www.pulumi.com/images/logo/logo.svg', params: [{ id: 'version', label: 'Pulumi Versiyonu', type: 'select', options: ['v3.123.0', 'v3.122.0', 'v3.121.0', 'v3.120.0', 'v3.119.0'], defaultValue: 'v3.123.0' }, {id: 'language', label: 'Programlama Dili', type: 'select', options: ['TypeScript', 'Python', 'Go'], defaultValue: 'TypeScript'}] }, ] }, { name: "İzleme & Loglama", tools: [ { id: 'prometheus-grafana', name: 'Prometheus & Grafana', description: 'Güçlü izleme ve görselleştirme ikilisi.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg', params: [ { id: 'version', label: 'Prometheus Versiyonu', type: 'select', options: ['2.53.0', '2.52.0', '2.51.2', '2.50.1', '2.49.1'], defaultValue: '2.53.0' }, { id: 'grafana_domain', label: 'Grafana Erişimi İçin Domain Adı', type: 'text', placeholder: 'grafana.example.com' }, { id: 'exporters', label: 'Kurulacak Exporterlar', type: 'checkbox', options: ['Node Exporter', 'cAdvisor', 'Blackbox Exporter'] } ]}, { id: 'elasticsearch', name: 'Elasticsearch', description: 'Dağıtık, RESTful arama ve analiz motoru.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg', params: [ { id: 'version', label: 'Elasticsearch Versiyonu', type: 'select', options: ['8.14.1', '8.13.4', '8.12.2', '8.11.4', '8.10.4'], defaultValue: '8.14.1' }, { id: 'cluster_name', label: 'Cluster Adı', type: 'text', placeholder: 'my-es-cluster', defaultValue: 'my-es-cluster' } ]}, { id: 'loki', name: 'Loki', description: 'Prometheus\'tan ilham alan, log toplama sistemi.', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Grafana_loki_logo.png', params: [ { id: 'version', label: 'Loki Versiyonu', type: 'select', options: ['3.1.0', '3.0.0', '2.9.8', '2.8.12', '2.7.10'], defaultValue: '3.1.0' }, { id: 'storage_backend', label: 'Depolama Arka Ucu', type: 'select', options: ['filesystem', 'S3', 'GCS'], defaultValue: 'filesystem' } ]}, { id: 'jaeger', name: 'Jaeger', description: 'Dağıtık sistemler için uçtan uca dağıtık izleme.', logo: 'https://raw.githubusercontent.com/cncf/artwork/master/projects/jaeger/icon/color/jaeger-icon-color.svg', params: [ { id: 'version', label: 'Jaeger Versiyonu', type: 'select', options: ['1.57.0', '1.56.0', '1.55.0', '1.54.0', '1.53.0'], defaultValue: '1.57.0' }, { id: 'storage_backend', label: 'Depolama Arka Ucu', type: 'select', options: ['in-memory', 'elasticsearch', 'cassandra'], defaultValue: 'in-memory' } ]}, ] }, { name: "Güvenlik", tools: [ { id: 'vault', name: 'HashiCorp Vault', description: 'Sırları ve hassas verileri güvenli bir şekilde yönetin.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vagrant/vagrant-original.svg', params: [{ id: 'version', label: 'Vault Versiyonu', type: 'select', options: ['1.17.1', '1.16.4', '1.15.8', '1.14.10', '1.13.12'], defaultValue: '1.17.1' }, {id: 'listener_protocol', label: 'Listener Protokolü', type: 'select', options: ['http', 'https'], defaultValue: 'http'}] }, { id: 'trivy', name: 'Trivy', description: 'Konteyner imajları ve diğer artifact\'ler için güvenlik açığı tarayıcısı.', logo: 'https://miro.medium.com/v2/resize:fit:365/0*BOCPr-Ifndo_1aKw.png', params: [{ id: 'version', label: 'Trivy Versiyonu', type: 'select', options: ['0.52.2', '0.51.2', '0.50.4', '0.49.1', '0.48.3'], defaultValue: '0.52.2' }] } ] }, { name: "Service Mesh", tools: [ { id: 'istio', name: 'Istio', description: 'Mikroservisleri bağlamak, güvenli hale getirmek ve izlemek için açık platform.', logo: 'https://cdn.prod.website-files.com/681e366f54a6e3ce87159ca4/687d7a5845ede448e0f6bff2_image4-1170x644.jpeg', params: [{ id: 'version', label: 'Istio Versiyonu', type: 'select', options: ['1.22.2', '1.21.4', '1.20.7', '1.19.11', '1.18.12'], defaultValue: '1.22.2' }, {id: 'profile', label: 'Kurulum Profili', type: 'select', options: ['default', 'demo', 'minimal'], defaultValue: 'default'}] }, { id: 'linkerd', name: 'Linkerd', description: 'Ultra hafif, inanılmaz derecede hızlı service mesh.', logo: 'https://raw.githubusercontent.com/cncf/artwork/master/projects/linkerd/icon/color/linkerd-icon-color.svg', params: [{ id: 'version', label: 'Linkerd Versiyonu', type: 'select', options: ['stable-2.14.13', 'stable-2.13.7', 'stable-2.12.5', 'edge-24.7.1', 'edge-24.6.3'], defaultValue: 'stable-2.14.13' }] } ] }, { name: "Veritabanı", tools: [ { id: 'postgresql', name: 'PostgreSQL', description: 'Güçlü, açık kaynaklı nesne-ilişkisel veritabanı sistemi.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', params: [{ id: 'version', label: 'PostgreSQL Versiyonu', type: 'select', options: ['16.3', '15.7', '14.12', '13.15', '12.19'], defaultValue: '16.3' }, {id: 'db_name', label: 'Veritabanı Adı', type: 'text', placeholder: 'mydatabase'}] }, { id: 'mongodb', name: 'MongoDB', description: 'Modern uygulamalar için ölçeklenebilir, esnek NoSQL veritabanı.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', params: [{ id: 'version', label: 'MongoDB Versiyonu', type: 'select', options: ['7.0.11', '6.0.15', '5.0.26', '4.4.31', '4.2.25'], defaultValue: '7.0.11' }, {id: 'db_name', label: 'Veritabanı Adı', type: 'text', placeholder: 'mydocumentdb'}] } ] }
];
const linuxDistros = [ 'Ubuntu 24.04 LTS', 'Ubuntu 22.04 LTS', 'Ubuntu 20.04 LTS', 'Debian 12', 'Debian 11', 'Red Hat Enterprise (RHEL) 9', 'Rocky Linux 9', 'AlmaLinux 9', 'Oracle Linux 9', 'CentOS Stream 9', 'Amazon Linux 2023', 'SUSE Linux Enterprise (SLES) 15', 'openSUSE Leap 15.6', 'Fedora Server 40', 'Arch Linux', 'Alpine Linux (Latest)' ];
const API_URL = 'https://intelliguide-ai-devops-co-pilot.onrender.com';

function App() {
    const [selectedTool, setSelectedTool] = useState(null);
    const [selectedOS, setSelectedOS] = useState(linuxDistros[0]);
    const [params, setParams] = useState({});
    const [guide, setGuide] = useState('');
    const [currentStep, setCurrentStep] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoadingGuide, setIsLoadingGuide] = useState(false);
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const chatContainerRef = useRef(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (window.mermaid) {
            window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
        }
    }, []);

    useEffect(() => { if (chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; } }, [chatHistory, isLoadingChat]);

    const handleSelectTool = (tool) => {
        if (tool.params && tool.params.length > 0) {
            setSelectedTool(tool);
            const initialParams = tool.params.reduce((acc, param) => {
                if (param.type === 'number') { acc[param.id] = param.defaultValue || 1; }
                else if (param.type === 'checkbox') { acc[param.id] = []; }
                else { acc[param.id] = param.defaultValue || (param.type === 'select' ? param.options[0] : ''); }
                if (param.id.endsWith('_count')) { const nodeType = param.id.replace('_count', ''); acc[`${nodeType}_nodes`] = Array(acc[param.id]).fill(''); }
                return acc;
            }, {});
            setParams(initialParams);
        } else {
            setSelectedTool(tool);
            setParams({});
            handleGenerateGuide(tool, {}, selectedOS);
        }
    };
    
    const handleGenerateGuide = async (toolToUse = selectedTool, paramsToUse = params, osToUse = selectedOS) => {
        abortControllerRef.current = new AbortController();
        setIsLoadingGuide(true);
        setGuide('');
        setCurrentStep(null);
        setChatHistory([{ sender: 'bot', text: `Harika! ${toolToUse.name} kurulumu için ${osToUse} rehberiniz hazırlanıyor...` }]);
        
        try {
            const response = await fetch(`${API_URL}/api/v2/generate-guide`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool: toolToUse, params: paramsToUse, os: osToUse }),
                signal: abortControllerRef.current.signal
            });
            if (!response.ok) { throw new Error(`Sunucu hatası: ${response.status}`); }
            const data = await response.json();
            setGuide(data.guide);
            setChatHistory(prev => [...prev, { sender: 'bot', text: `İşte rehberiniz! Bir adıma odaklanmak için yanındaki hedef ikonuna tıklayabilir, bir sorunla karşılaşırsanız buradan bana sorabilirsiniz.` }]);
        } catch (error) {
            if (error.name === 'AbortError') { console.log('Request canceled by user.'); }
            else { console.error("Rehber oluşturma hatası:", error); setChatHistory(prev => [...prev, { sender: 'bot', text: `Üzgünüm, bir hata oluştu: ${error.message}` }]); }
        } finally {
            setIsLoadingGuide(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoadingChat) return;
        const newHistory = [...chatHistory, { sender: 'user', text: userInput }];
        setChatHistory(newHistory);
        setUserInput('');
        setIsLoadingChat(true);
        try {
            const response = await fetch(`${API_URL}/api/v2/ask-assistant`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool: selectedTool, chat_history: newHistory, question: userInput, current_step: currentStep })
            });
            if (!response.ok) { throw new Error(`Sunucu hatası: ${response.status}`); }
            const data = await response.json();
            setChatHistory(prev => [...prev, { sender: 'bot', text: data.answer }]);
        } catch (error) {
            console.error("Asistan yanıt hatası:", error);
            setChatHistory(prev => [...prev, { sender: 'bot', text: `Üzgünüm, bir hata oluştu: ${error.message}` }]);
        } finally {
            setIsLoadingChat(false);
        }
    };

    const handleBackToSelection = () => {
        if (isLoadingGuide && abortControllerRef.current) { abortControllerRef.current.abort(); }
        setSelectedTool(null);
        setGuide('');
        setParams({});
        setIsLoadingGuide(false);
    };

    const renderContent = () => {
        if (isLoadingGuide || guide) { return ( <div className="flex flex-col md:flex-row h-full w-full gap-6"> <GuideDisplay guide={guide} isLoading={isLoadingGuide} onBack={handleBackToSelection} toolName={selectedTool ? selectedTool.name : ''} onSetStep={setCurrentStep} currentStep={currentStep}/> <ChatAssistant history={chatHistory} userInput={userInput} onUserInput={setUserInput} onSendMessage={handleSendMessage} isLoading={isLoadingChat} chatContainerRef={chatContainerRef} /> </div> ); }
        if (selectedTool) { return <ParameterScreen tool={selectedTool} params={params} onParamChange={setParams} onGenerate={() => handleGenerateGuide(selectedTool, params, selectedOS)} onBack={handleBackToSelection} />; }
        return <ToolSelectionScreen onSelect={handleSelectTool} selectedOS={selectedOS} onOSChange={setSelectedOS} />;
    };

    return ( <div className="bg-gray-900 text-white min-h-screen font-sans p-4 md:p-8"> <Header /> <main className="mt-8 flex-grow">{renderContent()}</main> <Footer /> </div> );
}

const Header = () => ( <header className="text-center"> <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">IntelliGuide</h1> <p className="text-gray-400 mt-2 text-lg">Mimarini Seç, Rehberini Anında Oluştur</p> </header> );
const Footer = () => ( <footer className="text-center mt-12 text-gray-500 text-sm"> <p>&copy; 2025 IntelliGuide. Sarper ERKOL. Tüm hakları saklıdır.</p> </footer> );
const ToolSelectionScreen = ({ onSelect, selectedOS, onOSChange }) => ( <div className="max-w-7xl mx-auto animate-fade-in"> <div className="text-center max-w-3xl mx-auto"> <h2 className="text-3xl font-bold text-gray-100">DevOps Araç Kütüphanesi</h2> <p className="text-gray-400 my-4">Kurulum rehberini almak istediğiniz aracı ve hedef işletim sistemini seçin. AI asistanımız, size özel adımları anında oluşturacaktır.</p> <div className="inline-block relative mb-12"> <label htmlFor="os-select" className="text-sm text-gray-400 mr-2">Hedef İşletim Sistemi:</label> <select id="os-select" value={selectedOS} onChange={(e) => onOSChange(e.target.value)} className="bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"> {linuxDistros.map(os => <option key={os} value={os}>{os}</option>)} </select> </div> </div> <div className="space-y-12"> {toolCategories.map(category => ( <div key={category.name}> <h3 className="text-2xl font-semibold text-blue-400 mb-6 border-b-2 border-gray-700 pb-2">{category.name}</h3> <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {category.tools.map(tool => ( <div key={tool.id} onClick={() => onSelect(tool)} className="tool-card rounded-lg p-5 flex flex-col items-center text-center cursor-pointer h-full"> <img src={tool.logo} alt={`${tool.name} logo`} className="h-20 w-20 mb-4 object-contain" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/80x80/1f2937/ffffff?text=?'; }} /> <h4 className="text-lg font-bold text-white">{tool.name}</h4> <p className="text-gray-400 mt-2 text-sm flex-grow">{tool.description}</p> </div> ))} </div> </div> ))} </div> </div> );
const ParameterScreen = ({ tool, params, onParamChange, onGenerate, onBack }) => { const handleSimpleChange = (id, value) => { onParamChange(prev => ({ ...prev, [id]: value })); }; const handleCheckboxChange = (id, option) => { onParamChange(prev => { const currentValues = prev[id] || []; const newValues = currentValues.includes(option) ? currentValues.filter(item => item !== option) : [...currentValues, option]; return { ...prev, [id]: newValues }; }); }; const handleNodeCountChange = (type, value) => { const count = Math.max(0, parseInt(value, 10) || 0); const nodesKey = `${type}_nodes`; const countKey = `${type}_count`; onParamChange(prev => { const newNodes = Array(count).fill('').map((_, i) => (prev[nodesKey] && prev[nodesKey][i]) || ''); return { ...prev, [countKey]: count, [nodesKey]: newNodes }; }); }; const handleNodeIpChange = (type, index, value) => { const key = `${type}_nodes`; onParamChange(prev => { const newNodes = [...prev[key]]; newNodes[index] = value; return { ...prev, [key]: newNodes }; }); }; const renderDynamicNodeParams = (nodeType, label) => ( <div key={`${nodeType}-group`}> <div className="mb-4"> <label className="block text-sm font-medium text-gray-300 mb-1">{`${label} Sayısı`}</label> <input type="number" min="0" value={params[`${nodeType}_count`]} onChange={(e) => handleNodeCountChange(nodeType, e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"/> </div> {Array.from({ length: params[`${nodeType}_count`] || 0 }).map((_, i) => ( <div className="mb-2 pl-4 border-l-2 border-gray-600" key={`${nodeType}-${i}`}> <label className="block text-sm font-medium text-gray-300 mb-1">{`${label} #${i + 1} IP/Hostname`}</label> <input type="text" value={params[`${nodeType}_nodes`][i]} onChange={(e) => handleNodeIpChange(nodeType, i, e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"/> </div> ))} </div> ); return ( <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg border border-gray-700 animate-fade-in"> <div className="flex items-center mb-6"> <img src={tool.logo} alt={`${tool.name} logo`} className="h-12 w-12 mr-4 object-contain" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/1f2937/ffffff?text=Logo'; }}/> <h2 className="text-2xl font-bold">"{tool.name}" Kurulum Parametreleri</h2> </div> <div className="space-y-4"> {tool.params.map(param => { if (param.id.endsWith('_count')) { const nodeType = param.id.replace('_count', ''); const label = nodeType.charAt(0).toUpperCase() + nodeType.slice(1) + " Node"; return renderDynamicNodeParams(nodeType, label); } if (param.id.endsWith('_nodes')) return null; return ( <div key={param.id}> <label htmlFor={param.id} className="block text-sm font-medium text-gray-300 mb-1">{param.label}</label> {param.type === 'select' && <select id={param.id} value={params[param.id]} onChange={(e) => handleSimpleChange(param.id, e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"> {param.options.map(opt => <option key={opt} value={opt}>{opt}</option>)} </select>} {param.type === 'text' && <input type="text" id={param.id} value={params[param.id]} onChange={(e) => handleSimpleChange(param.id, e.target.value)} placeholder={param.placeholder} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" />} {param.type === 'checkbox' && <div> {param.options.map(opt => ( <label key={opt} className="flex items-center space-x-2 text-gray-300"> <input type="checkbox" checked={(params[param.id] || []).includes(opt)} onChange={() => handleCheckboxChange(param.id, opt)} className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500" /> <span>{opt}</span> </label> ))} </div>} </div> ); })} </div> <div className="mt-8 flex justify-between items-center"> <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">&larr; Geri Dön</button> <button onClick={onGenerate} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">Rehberi Oluştur</button> </div> </div> ); };
const MermaidDiagram = ({ chart }) => { const ref = useRef(null); useEffect(() => { if (ref.current && chart && window.mermaid) { try { window.mermaid.render('mermaid-graph-' + Date.now(), chart, (svgCode) => { ref.current.innerHTML = svgCode; }); } catch(e) { console.error("Mermaid render error:", e); ref.current.innerHTML = "<p class='text-red-400'>Diyagram oluşturulurken bir hata oluştu.</p>"; } } }, [chart]); return <div ref={ref} className="mermaid flex justify-center my-4 p-4 bg-gray-900/50 rounded-lg"></div>; };
const GuideDisplay = ({ guide, isLoading, onBack, toolName, onSetStep, currentStep }) => {
    const [parsedContent, setParsedContent] = useState([]);
    useEffect(() => {
        if (!guide) { setParsedContent([]); return; }
        const content = [];
        const regex = /(\[ON:[^\]]+\]\n*```[\s\S]*?```|\[INFO\][\s\S]*?\[\/INFO\]|```mermaid\n[\s\S]*?```|## .*)/g;
        let lastIndex = 0;
        guide.split(regex).forEach(part => {
            if (!part || part.trim() === '') return;
            const serverMatch = part.match(/^\[ON:\s*([^\]]+)\]\n*```(\w*)\n([\s\S]*?)```$/);
            const infoMatch = part.match(/^\[INFO\]([\s\S]*?)\[\/INFO\]$/);
            const mermaidMatch = part.match(/^```mermaid\n([\s\S]*?)```$/);
            const headingMatch = part.match(/^## (.*)/);

            if (serverMatch) { content.push({ type: 'code', server: serverMatch[1], lang: serverMatch[2] || 'bash', content: serverMatch[3] }); }
            else if (infoMatch) { content.push({ type: 'info', content: infoMatch[1].trim() }); }
            else if (mermaidMatch) { content.push({ type: 'mermaid', content: mermaidMatch[1] }); }
            else if (headingMatch) { content.push({ type: 'step', heading: headingMatch[1], fullText: part }); }
            else { content.push({ type: 'text', content: part }); }
        });
        setParsedContent(content);
    }, [guide]);

    const handleCopy = (code) => { const el = document.createElement('textarea'); el.value = code; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); };

    return ( <div className="w-full md:w-3/5 lg:w-2/3 bg-gray-800 p-6 rounded-lg border border-gray-700 h-[80vh] flex flex-col animate-fade-in"> <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700 flex-shrink-0"> <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors flex items-center"> &larr; <span className="ml-2">Araç Seçimine Dön</span> </button> <h2 className="text-xl font-bold text-center">{toolName} Kurulum Rehberi</h2> </div> <div className="overflow-y-auto flex-grow pr-2"> {isLoading ? ( <div className="flex flex-col items-center justify-center h-full"> <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div> <p className="mt-4 text-gray-400">AI Asistanınız rehberi hazırlıyor...</p> </div> ) : ( parsedContent.map((item, index) => {
        if (item.type === 'mermaid') return <MermaidDiagram key={index} chart={item.content} />;
        if (item.type === 'code') return ( <div key={index} className="bg-gray-900/50 rounded-md my-4 relative border border-gray-700"> <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 rounded-t-md"> <div className="text-xs font-semibold text-gray-300"><span className="text-blue-400 mr-2">Çalıştırılacak Sunucu:</span>{item.server}</div> <button onClick={() => handleCopy(item.content)} className="flex items-center text-xs text-gray-300 hover:text-white transition-colors"> <CopyIcon /> <span className="ml-2">Kopyala</span> </button> </div> <pre className="p-4 text-sm overflow-x-auto text-left"><code>{item.content}</code></pre> </div> );
        if (item.type === 'info') return ( <div key={index} className="flex items-start p-3 my-4 bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg"> <InfoIcon /> <p className="text-blue-200 text-sm" dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br />') }}></p> </div> );
        if (item.type === 'step') { const headingText = item.heading; const isActive = currentStep === headingText; const bodyText = item.fullText.replace(/^## .*\n?/, ''); return ( <div key={index} className="prose prose-invert max-w-none"> <h2 id={`step-${index}`}> <span>{headingText}</span> <button onClick={() => onSetStep(isActive ? null : headingText)} className={`p-2 rounded-full transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`} title="Bu adımı hedefle"> <TargetIcon /> </button> </h2> <p dangerouslySetInnerHTML={{ __html: bodyText.replace(/\n/g, '<br />') }} /> </div> ); }
        return <p key={index} className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br />') }} />;
    }) )} </div> </div> );
};
const ChatAssistant = ({ history, userInput, onUserInput, onSendMessage, isLoading, chatContainerRef }) => ( <div className="w-full md:w-2/5 lg:w-1-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col h-[80vh] animate-fade-in"> <h2 className="text-xl font-bold text-center p-4 border-b border-gray-700 flex-shrink-0">AI Asistan</h2> <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto"> {history.map((msg, index) => ( <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}> {msg.sender === 'bot' && <div className="bg-blue-500 p-2 rounded-full flex-shrink-0"><BotIcon /></div>} <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-purple-600' : 'bg-gray-700'}`}> <p className="text-sm whitespace-pre-wrap">{msg.text}</p> </div> {msg.sender === 'user' && <div className="bg-purple-600 p-2 rounded-full flex-shrink-0"><UserIcon /></div>} </div> ))} {isLoading && ( <div className="flex items-start gap-3"> <div className="bg-blue-500 p-2 rounded-full flex-shrink-0"><BotIcon /></div> <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-gray-700"> <div className="flex items-center space-x-2"> <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div> <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div> <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div> </div> </div> </div> )} </div> <form onSubmit={onSendMessage} className="p-4 border-t border-gray-700 flex-shrink-0"> <div className="flex items-center bg-gray-700 rounded-lg"> <input type="text" value={userInput} onChange={(e) => onUserInput(e.target.value)} placeholder="Bir soru sorun veya hatayı yapıştırın..." className="w-full bg-transparent p-3 focus:outline-none" disabled={isLoading} /> <button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 text-white disabled:text-gray-500 transition-colors"> {isLoading ? <LoadingSpinner /> : <SendIcon />} </button> </div> </form> </div> );

export default App;
