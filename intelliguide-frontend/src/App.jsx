import React, { useState, useEffect, useRef } from 'react';

// Ikonlar ve veri listeleri...
const BotIcon = () => ( <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg> );
const UserIcon = () => ( <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const SendIcon = () => ( <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> );
const CopyIcon = () => ( <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const LoadingSpinner = () => ( <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> );
const TargetIcon = () => ( <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> );
const InfoIcon = () => ( <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> );
const toolCategories = [ { name: "Container & Orkestrasyon", tools: [ { id: 'docker', name: 'Docker', description: 'Uygulamaları konteynerler ile geliştirin, dağıtın ve çalıştırın.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg)', params: [] }, { id: 'kubernetes', name: 'Kubernetes', description: 'Konteynerize uygulamaların dağıtımı ve yönetimini otomatikleştirin.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg)', params: [ { id: 'version', label: 'Kubernetes Versiyonu', type: 'select', options: ['1.28.3', '1.27.7', '1.26.10'], defaultValue: '1.28.3' }, { id: 'master_count', label: 'Master Node Sayısı', type: 'number', min: 1, max: 5, defaultValue: 1 }, { id: 'worker_count', label: 'Worker Node Sayısı', type: 'number', min: 0, max: 10, defaultValue: 1 }, ]}, { id: 'rancher-rke2', name: 'Rancher / RKE2', description: 'Kurumsal Kubernetes yönetimi için komple bir platform.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rancher/rancher-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rancher/rancher-original.svg)', params: [ { id: 'master_count', label: 'Master Node Sayısı', type: 'number', min: 1, max: 5, defaultValue: 1 }, { id: 'worker_count', label: 'Worker Node Sayısı', type: 'number', min: 0, max: 10, defaultValue: 1 }, ]}, { id: 'helm', name: 'Helm', description: 'Kubernetes için paket yöneticisi.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/helm/helm-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/helm/helm-original.svg)', params: [] }, ] }, { name: "CI/CD", tools: [ { id: 'jenkins', name: 'Jenkins', description: 'Popüler, açık kaynaklı otomasyon sunucusu.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg)', params: [ { id: 'domain_name', label: 'Jenkins Erişimi İçin Domain Adı', type: 'text', placeholder: 'jenkins.example.com' }, { id: 'admin_user', label: 'Admin Kullanıcı Adı (Opsiyonel)', type: 'text', placeholder: 'admin' } ]}, { id: 'gitlab-ci', name: 'GitLab CI/CD', description: 'GitLab ile entegre, güçlü CI/CD çözümü.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg)', params: [{id: 'gitlab_runner_tags', label: 'Runner Etiketleri (virgülle ayırın)', type: 'text', placeholder: 'docker,prod'}] }, { id: 'github-actions', name: 'GitHub Actions', description: 'GitHub reponuzdan yazılım iş akışlarını otomatikleştirin.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg)', params: [{id: 'runner_scope', label: 'Self-Hosted Runner Kapsamı (repo/org)', type: 'text', placeholder: 'my-org/my-repo'}] }, { id: 'argocd', name: 'Argo CD', description: 'Kubernetes için bildirimsel, GitOps sürekli dağıtım aracı.', logo: '[https://raw.githubusercontent.com/cncf/artwork/master/projects/argo/icon/color/argo-icon-color.svg](https://raw.githubusercontent.com/cncf/artwork/master/projects/argo/icon/color/argo-icon-color.svg)', params: [ { id: 'kube_namespace', label: 'Kurulacak Kubernetes Namespace', type: 'text', placeholder: 'argocd', defaultValue: 'argocd' }, { id: 'install_cli', label: 'Argo CD CLI kurulsun mu?', type: 'select', options: ['Evet', 'Hayır'], defaultValue: 'Evet' } ]}, ] }, { name: "Altyapı Kodu (IaC)", tools: [ { id: 'terraform', name: 'Terraform', description: 'Altyapıyı güvenli ve verimli bir şekilde oluşturun, değiştirin.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg)', params: [{id: 'provider', label: 'Bulut Sağlayıcı', type: 'select', options: ['AWS', 'Azure', 'Google Cloud'], defaultValue: 'AWS'}] }, { id: 'ansible', name: 'Ansible', description: 'Uygulama dağıtımı ve konfigürasyon yönetimi için otomasyon.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg)', params: [{id: 'inventory_hosts', label: 'Hedef Hostlar (virgülle ayırın)', type: 'text', placeholder: 'server1.example.com, server2.example.com'}] }, { id: 'pulumi', name: 'Pulumi', description: 'Favori dilinizi kullanarak altyapı oluşturun ve dağıtın.', logo: '[https://www.pulumi.com/images/logo/logo.svg](https://www.pulumi.com/images/logo/logo.svg)', params: [{id: 'language', label: 'Programlama Dili', type: 'select', options: ['TypeScript', 'Python', 'Go'], defaultValue: 'TypeScript'}] }, ] }, { name: "İzleme & Loglama", tools: [ { id: 'prometheus-grafana', name: 'Prometheus & Grafana', description: 'Güçlü izleme ve görselleştirme ikilisi.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg)', params: [ { id: 'grafana_domain', label: 'Grafana Erişimi İçin Domain Adı', type: 'text', placeholder: 'grafana.example.com' }, { id: 'exporters', label: 'Kurulacak Exporterlar', type: 'checkbox', options: ['Node Exporter', 'cAdvisor', 'Blackbox Exporter'] } ]}, { id: 'elasticsearch', name: 'Elasticsearch', description: 'Dağıtık, RESTful arama ve analiz motoru.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg)', params: [ { id: 'cluster_name', label: 'Cluster Adı', type: 'text', placeholder: 'my-es-cluster', defaultValue: 'my-es-cluster' } ]}, { id: 'loki', name: 'Loki', description: 'Prometheus\'tan ilham alan, log toplama sistemi.', logo: '[https://www.svgrepo.com/show/373773/loki.svg](https://www.svgrepo.com/show/373773/loki.svg)', params: [ { id: 'storage_backend', label: 'Depolama Arka Ucu', type: 'select', options: ['filesystem', 'S3', 'GCS'], defaultValue: 'filesystem' } ]}, { id: 'jaeger', name: 'Jaeger', description: 'Dağıtık sistemler için uçtan uca dağıtık izleme.', logo: '[https://raw.githubusercontent.com/cncf/artwork/master/projects/jaeger/icon/color/jaeger-icon-color.svg](https://raw.githubusercontent.com/cncf/artwork/master/projects/jaeger/icon/color/jaeger-icon-color.svg)', params: [ { id: 'storage_backend', label: 'Depolama Arka Ucu', type: 'select', options: ['in-memory', 'elasticsearch', 'cassandra'], defaultValue: 'in-memory' } ]}, ] }, { name: "Güvenlik", tools: [ { id: 'vault', name: 'HashiCorp Vault', description: 'Sırları ve hassas verileri güvenli bir şekilde yönetin.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vagrant/vagrant-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vagrant/vagrant-original.svg)', params: [{id: 'listener_protocol', label: 'Listener Protokolü', type: 'select', options: ['http', 'https'], defaultValue: 'http'}] }, { id: 'trivy', name: 'Trivy', description: 'Konteyner imajları ve diğer artifact\'ler için güvenlik açığı tarayıcısı.', logo: '[https://www.aquasec.com/wp-content/uploads/2021/10/trivy-icon-color.svg](https://www.aquasec.com/wp-content/uploads/2021/10/trivy-icon-color.svg)', params: [] } ] }, { name: "Service Mesh", tools: [ { id: 'istio', name: 'Istio', description: 'Mikroservisleri bağlamak, güvenli hale getirmek ve izlemek için açık platform.', logo: '[https://www.svgrepo.com/show/373686/istio.svg](https://www.svgrepo.com/show/373686/istio.svg)', params: [{id: 'profile', label: 'Kurulum Profili', type: 'select', options: ['default', 'demo', 'minimal'], defaultValue: 'default'}] }, { id: 'linkerd', name: 'Linkerd', description: 'Ultra hafif, inanılmaz derecede hızlı service mesh.', logo: '[https://raw.githubusercontent.com/cncf/artwork/master/projects/linkerd/icon/color/linkerd-icon-color.svg](https://raw.githubusercontent.com/cncf/artwork/master/projects/linkerd/icon/color/linkerd-icon-color.svg)', params: [] } ] }, { name: "Veritabanı", tools: [ { id: 'postgresql', name: 'PostgreSQL', description: 'Güçlü, açık kaynaklı nesne-ilişkisel veritabanı sistemi.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg)', params: [{id: 'db_name', label: 'Veritabanı Adı', type: 'text', placeholder: 'mydatabase'}] }, { id: 'mongodb', name: 'MongoDB', description: 'Modern uygulamalar için ölçeklenebilir, esnek NoSQL veritabanı.', logo: '[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg)', params: [{id: 'db_name', label: 'Veritabanı Adı', type: 'text', placeholder: 'mydocumentdb'}] } ] } ];
const linuxDistros = [ 'Ubuntu 22.04 LTS', 'Ubuntu 20.04 LTS', 'Debian 11', 'Debian 10', 'CentOS Stream 9', 'CentOS Stream 8', 'Rocky Linux 9', 'AlmaLinux 9', 'Fedora 38', 'Fedora 37', 'Alpine Linux (Latest)' ];

const API_URL = import.meta.env.VITE_API_BASE_URL || '[https://intelliguide-ai-devops-co-pilot.onrender.com](https://intelliguide-ai-devops-co-pilot.onrender.com)';

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

// Geri kalan tüm bileşenler (Header, Footer, ToolSelectionScreen, vs.) aynı kalabilir.
// ...

export default App;
