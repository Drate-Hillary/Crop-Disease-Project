document.addEventListener('DOMContentLoaded', function () {
            const dashboardSection = document.getElementById('dashboard-section');
            const uploadDiagnosisSection = document.getElementById('upload-diagnosis-section');
            const historySection = document.getElementById('history-section');
            const diseaseLibrarySection = document.getElementById('disease-library-section');
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            const quickActionButtons = document.querySelectorAll('.quick-action-btn');
            const uploadArea = document.getElementById('uploadArea');
            const fileInput = document.getElementById('fileInput');
            const previewSection = document.getElementById('previewSection');
            const imagePreview = document.getElementById('imagePreview');
            const changeImageBtn = document.getElementById('changeImageBtn');
            const confirmImageBtn = document.getElementById('confirmImageBtn');
            const cropSelectionSection = document.getElementById('cropSelectionSection');
            const backToUploadBtn = document.getElementById('backToUploadBtn');
            const analyzeBtn = document.getElementById('analyzeBtn');
            const backToDashboardBtn = document.querySelector('#upload-diagnosis-section .btn-outline-secondary[data-section="dashboard"]');
            const diseaseSearch = document.getElementById('diseaseSearch');
            const searchDiseaseBtn = document.getElementById('searchDiseaseBtn');
            const cropFilter = document.getElementById('cropFilter');
            const severityFilter = document.getElementById('severityFilter');
            const diseaseItems = document.querySelectorAll('.disease-item');

            // Navigation between sections
            function showSection(sectionId) {
                dashboardSection.style.display = sectionId === 'dashboard' ? 'block' : 'none';
                uploadDiagnosisSection.style.display = sectionId === 'upload-diagnosis' ? 'block' : 'none';
                historySection.style.display = sectionId === 'history' ? 'block' : 'none';
                diseaseLibrarySection.style.display = sectionId === 'disease-library' ? 'block' : 'none';
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            navLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const section = this.getAttribute('data-section');
                    if (section) {
                        showSection(section);
                    }
                });
            });

            quickActionButtons.forEach(button => {
                button.addEventListener('click', function (e) {
                    const section = this.getAttribute('data-section');
                    if (section) {
                        showSection(section);
                    }
                });
            });

            backToDashboardBtn.addEventListener('click', function (e) {
                e.preventDefault();
                showSection('dashboard');
            });

            // Upload Diagnosis Functionality
            uploadArea.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', function (e) {
                if (e.target.files.length) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        imagePreview.src = event.target.result;
                        uploadArea.style.display = 'none';
                        previewSection.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });

            changeImageBtn.addEventListener('click', function () {
                uploadArea.style.display = 'block';
                previewSection.style.display = 'none';
                fileInput.value = '';
            });

            confirmImageBtn.addEventListener('click', function () {
                cropSelectionSection.style.display = 'block';
                document.querySelector('.step-indicator .step:nth-child(1)').classList.remove('active');
                document.querySelector('.step-indicator .step:nth-child(2)').classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            backToUploadBtn.addEventListener('click', function () {
                cropSelectionSection.style.display = 'none';
                document.querySelector('.step-indicator .step:nth-child(1)').classList.add('active');
                document.querySelector('.step-indicator .step:nth-child(2)').classList.remove('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            analyzeBtn.addEventListener('click', function () {
                alert('Image submitted for analysis. This would connect to the AI model in the real application.');
                document.querySelector('.step-indicator .step:nth-child(2)').classList.remove('active');
                document.querySelector('.step-indicator .step:nth-child(3)').classList.add('active');
            });

            const plantPartBtns = document.querySelectorAll('.plant-part-btn');
            plantPartBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    plantPartBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            const cropLinks = document.querySelectorAll('.crop-selector .nav-link');
            cropLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    cropLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Disease Library Functionality
            function filterDiseases() {
                const searchTerm = diseaseSearch.value.toLowerCase();
                const crop = cropFilter.value;
                const severity = severityFilter.value;

                diseaseItems.forEach(item => {
                    const diseaseName = item.querySelector('.card-title').textContent.toLowerCase();
                    const itemCrop = item.getAttribute('data-crop');
                    const itemSeverity = item.getAttribute('data-severity');

                    const matchesSearch = searchTerm === '' || diseaseName.includes(searchTerm);
                    const matchesCrop = crop === 'All Crops' || itemCrop === crop;
                    const matchesSeverity = severity === 'All Severities' || itemSeverity === severity;

                    item.style.display = matchesSearch && matchesCrop && matchesSeverity ? 'block' : 'none';
                });
            }

            diseaseSearch.addEventListener('input', filterDiseases);
            searchDiseaseBtn.addEventListener('click', filterDiseases);
            cropFilter.addEventListener('change', filterDiseases);
            severityFilter.addEventListener('change', filterDiseases);

            const toggleDetailsButtons = document.querySelectorAll('.toggle-details');
            toggleDetailsButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const details = this.closest('.card-body').querySelector('.disease-details');
                    const icon = this.querySelector('i');
                    if (details.style.display === 'none' || details.style.display === '') {
                        details.style.display = 'block';
                        icon.classList.remove('bi-chevron-down');
                        icon.classList.add('bi-chevron-up');
                        this.innerHTML = `<i class="bi bi-chevron-up"></i> Hide Details`;
                    } else {
                        details.style.display = 'none';
                        icon.classList.remove('bi-chevron-up');
                        icon.classList.add('bi-chevron-down');
                        this.innerHTML = `<i class="bi bi-chevron-down"></i> Details`;
                    }
                });
            });
        });