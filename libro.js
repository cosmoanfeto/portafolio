document.addEventListener('DOMContentLoaded', function () {
    const book = document.querySelector('.book');
    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');
    const currentPageElement = document.querySelector('.current-page');

    let currentPage = 1;

    function updatePagination() {
        currentPageElement.textContent = currentPage;
    }

    prevButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            updatePageTransform();
        }
    });

    nextButton.addEventListener('click', function () {
        const totalPages = document.querySelectorAll('.page').length;
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            updatePageTransform();
        }
    });

    function updatePageTransform() {
        const translation = -100 * (currentPage - 1) + '%';
        book.style.transform = 'translateX(' + translation + ')';
    }
});
