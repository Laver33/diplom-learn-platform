'use client'

import MainDescription from "@/components/mainDescription"
import PagesTitle from "@/components/pagesTitle"


const DashboardPage = () => {
    const titleDashboard = 'Прохожу'
    const descDashboard = 'Здесь все курсы, которые вы прошли или проходите в данный момент'


    return(
        <div>
            <PagesTitle title={titleDashboard} />
            <MainDescription description={descDashboard} />
        
        
        </div>
    )
}

export default DashboardPage;