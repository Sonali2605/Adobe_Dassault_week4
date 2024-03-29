export function getLocalizedContent(localizedData: any[]): {
    name: string
    description: string
    overview: string
    richTextOverview: string
  } {
    let name: string = ''
    let description: string = ''
    let overview: string = ''
    let richTextOverview: string = ''
   
    if (localizedData && localizedData?.length == 1) {
      name = localizedData[0]?.name
      description = localizedData[0]?.description
      overview = localizedData[0]?.overview
      richTextOverview = localizedData[0]?.richTextOverview
    } else if (localizedData && localizedData?.length > 1) {
      const selectedLanguage = localizedData.find(
        (item: any) => item.locale === localStorage.getItem("selectedLanguage"),
      )
   
      if (selectedLanguage) {
        name = selectedLanguage.name
        description = selectedLanguage.description
        overview = selectedLanguage?.overview
        richTextOverview = selectedLanguage?.richTextOverview
      } else {
        const enContent = localizedData.find(
          (item: any) => item.locale === 'en-US',
        )
        if (enContent) {
          name = enContent.name
          description = enContent.description
          overview = enContent?.overview
          richTextOverview = enContent?.richTextOverview
        }
      }
    }
   
    return { name, description, overview, richTextOverview }
  }