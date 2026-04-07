

const MainDescription = (props: {description: string}) => {

    return(
        <div className="py-1">
            <p className="text-gray-500">{props.description}</p>
        </div>
    )
}

export default MainDescription;