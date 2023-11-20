import Image from 'next/image';
import React from 'react'

type PopoverSidebarContentProps = {
    onClick?: () => void;
    imagePath: string;
    contentTitle: string;
    textColor: string;
}

const PopoverSidebarContent = ({ onClick, imagePath, contentTitle, textColor }: PopoverSidebarContentProps) => {
    return (

        <div
        onClick={onClick} 
        className='flex my-2 hover:scale-105 hover:cursor-pointer transition duration-200'>
            <button className={`text-[16px] text-${textColor}`}>{contentTitle}</button>
            <Image
                src={imagePath}
                width={24}
                height={20}
                alt='resume'
                className="mx-2"
            />
        </div>

    )
}

export default PopoverSidebarContent