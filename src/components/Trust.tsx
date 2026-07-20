"use client"

import { gsap } from 'gsap'
import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'

const icons = [
	{ title: 'mira', icon: '/trust/1.png', width: 224, height: 69, hasLabel: false },
	{ title: 'title', icon: '/trust/2.png', width: 259, height: 69, hasLabel: false },
	{ title: 'Tribute', icon: '/trust/3.png', width: 262, height: 69, hasLabel: false },
	{ title: 'G-Gate Conference (GGC)', icon: '/trust/4.png', width: 204, height: 68, hasLabel: false },
	{ title: 'Spekter', icon: '/trust/5.png', width: 492, height: 69, hasLabel: false },
	{ title: 'Gift fest telegram', icon: '/trust/6.svg', width: 128, height: 128 },
	{ title: 'OPen Sea', icon: '/trust/7.png', width: 365, height: 95, hasLabel: false },
	{ title: 'goat gaming', icon: '/trust/8.svg', width: 128, height: 128 },
	{ title: 'Pudcy Party', icon: '/trust/9.svg', width: 128, height: 128 },
	{ title: 'Boinkers', icon: '/trust/10.svg', width: 128, height: 128 },
]

const marqueeIcons = [...icons, ...icons]

export default function Trust() {
	const marqueeRef = useRef<HTMLDivElement>(null)
	const trackRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		const marquee = marqueeRef.current
		const track = trackRef.current
		if (!marquee || !track) return

		const context = gsap.context(() => {
			const tween = gsap.to(track, {
				xPercent: -50,
				duration: 28,
				ease: 'none',
				repeat: -1,
			})
			let startX = 0
			let previousX = 0
			let previousTime = 0
			let startProgress = 0
			let velocity = 0
			let isDragging = false

			const wrapProgress = gsap.utils.wrap(0, 1)
			const onPointerDown = (event: PointerEvent) => {
				isDragging = true
				startX = previousX = event.clientX
				previousTime = performance.now()
				startProgress = tween.progress()
				velocity = 0
				marquee.classList.add('is-dragging')
				marquee.setPointerCapture(event.pointerId)
				tween.pause()
			}

			const onPointerMove = (event: PointerEvent) => {
				if (!isDragging) return
				const now = performance.now()
				const elapsed = Math.max(now - previousTime, 1)
				velocity = (event.clientX - previousX) / elapsed
				previousX = event.clientX
				previousTime = now
				const loopWidth = track.scrollWidth / 2
				tween.progress(wrapProgress(startProgress - (event.clientX - startX) / loopWidth))
			}

			const finishDrag = (event: PointerEvent) => {
				if (!isDragging) return
				isDragging = false
				marquee.classList.remove('is-dragging')
				if (marquee.hasPointerCapture(event.pointerId)) marquee.releasePointerCapture(event.pointerId)
				const loopWidth = track.scrollWidth / 2
				tween.progress(wrapProgress(tween.progress() - (velocity * 180) / loopWidth))
				tween.resume()
				gsap.fromTo(tween, { timeScale: 0.35 }, { timeScale: 1, duration: 0.8, ease: 'power2.out' })
			}

			marquee.addEventListener('pointerdown', onPointerDown)
			marquee.addEventListener('pointermove', onPointerMove)
			marquee.addEventListener('pointerup', finishDrag)
			marquee.addEventListener('pointercancel', finishDrag)

			return () => {
				marquee.removeEventListener('pointerdown', onPointerDown)
				marquee.removeEventListener('pointermove', onPointerMove)
				marquee.removeEventListener('pointerup', finishDrag)
				marquee.removeEventListener('pointercancel', finishDrag)
				tween.kill()
			}
		}, marquee)

		return () => context.revert()
	}, [])

	return (
		<section className='trust pt-20 sm:pt-32'>
			<div className="content_container">
				<h2 className="text-center numbers_gradient-text numbers_title uppercase">We’re trusted by</h2>
			</div>
			<div className="trust_marquee" ref={marqueeRef} aria-label="Trusted company logos">
				<div className="trust_track" ref={trackRef}>
					{marqueeIcons.map((icon, index) => (
						<div className={`trust_logo${icon.hasLabel === false ? ' trust_logo--png' : ''}`} key={`${icon.icon}-${index}`} aria-hidden={index >= icons.length}>
							<Image src={icon.icon} alt="" width={icon.width} height={icon.height} unoptimized={icon.hasLabel === false} />
							{icon.hasLabel !== false && <p>{icon.title}</p>}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
