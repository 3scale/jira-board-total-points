document.onreadystatechange = function() {

  const getTotalPointsForColumn = column => Array.from(column.querySelectorAll('aui-badge')).reduce((init, current) => init + parseFloat(current.textContent), 0)

  const displayTotalPoints = () => {
    const columns = document.querySelectorAll('.ghx-columns .ghx-column')

    columns.forEach((column) => {

      if (column.childNodes.length < 1) {
        return
      }

      const columnPoints = getTotalPointsForColumn(column)
      const div = document.createElement("div")
      const text = document.createTextNode("Total points: ")
      const span = document.createElement("span")
      const textSpan = document.createTextNode(columnPoints)
      span.appendChild(textSpan)
      div.setAttribute("style", "background-color:white; color: #172b4d; border: 1px solid #c1c7d0; padding: 3px")
      span.setAttribute("style", "float:right; background: rgba(9,30,66,0.13); font-weight: 600; border-radius: 2em; font-size: 12px; padding:2px 4px;")
      div.appendChild(text)
      div.appendChild(span)
      column.prepend(div)
    })
  }

  if (document.readyState === 'complete') {
    // The targetNode may change if Jira changes the ui
    const targetNode = document.getElementById('ghx-work')
    if (!targetNode) {
      return
    }
    const config = {
      childList: true,
      subtree: true
    }

    const observerCallback = function(mutationsList, observer) {
      for (let mutation of mutationsList) {
        // The mutation.target.id may change if Jira changes the ui
        if (mutation.type === 'childList' && mutation.target.id === "ghx-pool") {
          displayTotalPoints()
        }
      }
    }

    const observer = new MutationObserver(observerCallback)
    observer.observe(targetNode, config)
  }
}
