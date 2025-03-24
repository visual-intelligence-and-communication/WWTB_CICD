const Title = ({text, size = "h2"}) => {
    return (
        <div className={`font-title ${size === "h2" ? "text-5xl font-bold": "text-[calc(1vw+90px)] leading-[0.8] "} mb-4`}>
            {text}
        </div>
    )
}

export default Title;