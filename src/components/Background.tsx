import Image from 'next/image'
import type { ComponentPropsWithoutRef } from 'react'

type BackgroundProps = ComponentPropsWithoutRef<'div'>

export default function Background({
	children,
	className = '',
	...props
}: BackgroundProps) {
	return (
		<div
			className={`section_background relative isolate overflow-hidden ${className}`.trim()}
			{...props}
		>
			<Image
				src="/left_bg-asset.svg"
				alt=""
				width={1008}
				height={1464}
				className="pointer-events-none absolute left-0 top-1/2 -z-10 h-auto w-[min(52.5vw,1008px)] -translate-y-1/2 select-none max-md:w-[min(85vw,720px)] md:block hidden"
				aria-hidden="true"
			/>
			<Image
				src="/right_bg-asset.svg"
				alt=""
				width={1008}
				height={1464}
				className="pointer-events-none absolute right-0 top-1/2 -z-10 h-auto w-[min(52.5vw,1008px)] -translate-y-1/2 select-none max-md:w-[min(85vw,720px)] md:block hidden"
				aria-hidden="true"
			/>

			<div className="relative z-10">{children}</div>
		</div>
	)
}
