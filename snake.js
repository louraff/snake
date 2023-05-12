window.addEventListener('DOMContentLoaded', init)

function init() {
  const grid = document.querySelector('.grid')

   
  const width = 20
  const height = 20
  const cellCount = width * height
  const cells = []

    function createGrid() {
        
        //for loop to create grid cells using cellCount to create the grid cells
   
        for (let i = 0; i < cellCount; i++) {
           const cell = document.createElement('div') // creates 100 divs
           // add index to div element
        //    cell.innerText = i
           cell.id = i
           console.log(cell.id)
        
          
           //add index as an attribute
           cell.dataset.index = i //dataset is an array with key value pairs. id can be renamed anything eg index. Here's another way of writing it:   cell.setAttribute('data-index', i)
       
           // Add the height and width to each grid cell (div)
           cell.style.height = `${100 / height}%`
           cell.style.width = `${100 / width}%`
       
            // add cell to grid
            grid.appendChild(cell)
   
            // add newly created div cell to cells array
            cells.push(cell)
            
           }
    }

createGrid()
}