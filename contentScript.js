document.onreadystatechange = function() {

  const getTotalPointsForColumn = column => Array.from(column.querySelectorAll('aui-badge')).reduce((init, current) => init + Number(current.textContent), 0)

  const updateColumns = (column, columnPoints) => {
    const div = document.createElement("div")
    const text = document.createTextNode("Total points: ")
    const span = document.createElement("span")
    const textSpan = document.createTextNode(columnPoints)
    div.classList.add('TotalPoints--column-text')
    span.classList.add('TotalPoints--column-number')
    span.appendChild(textSpan)
    div.appendChild(text)
    div.appendChild(span)
    column.prepend(div)
  }

  const updateTitle = totalPoints => {
    const titleElem = document.querySelector('#ghx-header .subnav-container')
    const spanTotal = document.createElement("span")
    spanTotal.classList.add('TotalPoints--title')
    const textTotal = document.createTextNode(totalPoints)
    spanTotal.appendChild(textTotal)
    titleElem.appendChild(spanTotal)
  }

  const displayTotalPoints = () => {
    const columns = document.querySelectorAll('.ghx-columns .ghx-column')
    let totalPoints = 0

    columns.forEach((column) => {
      if (column.childNodes.length < 1) {
        return
      }
      const columnPoints = getTotalPointsForColumn(column)
      updateColumns(column, columnPoints)
      totalPoints += columnPoints;
    })

    updateTitle(totalPoints)
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
