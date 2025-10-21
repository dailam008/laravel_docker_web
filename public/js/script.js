// Konfirmasi sebelum hapus user
document.addEventListener('DOMContentLoaded', function() {
    const deleteForms = document.querySelectorAll('form button[type="submit"]');

    deleteForms.forEach(function(button) {
        button.addEventListener('click', function(e) {
            if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) {
                e.preventDefault();
            }
        });
    });
});
