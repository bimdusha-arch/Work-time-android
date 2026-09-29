package fi.worktime.app

import android.os.Bundle
import android.os.SystemClock
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.util.Locale

class MainActivity : AppCompatActivity() {
    private var running = false
    private var startedAt = 0L
    private lateinit var status: TextView
    private lateinit var timer: TextView
    private lateinit var button: Button

    private val ticker = object : Runnable {
        override fun run() {
            if (running) {
                val hours = (SystemClock.elapsedRealtime() - startedAt) / 3_600_000.0
                timer.text = String.format(Locale.US, "%.2f h", hours)
                timer.postDelayed(this, 1000)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        status = findViewById(R.id.status)
        timer = findViewById(R.id.timer)
        button = findViewById(R.id.startStop)

        button.setOnClickListener {
            running = !running
            if (running) {
                startedAt = SystemClock.elapsedRealtime()
                status.text = "Working"
                button.text = "STOP"
                timer.post(ticker)
            } else {
                status.text = "Stopped"
                button.text = "START"
                timer.removeCallbacks(ticker)
            }
        }
    }
}
